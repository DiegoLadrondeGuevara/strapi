import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap({ strapi }) {
    // Intercept file uploads to enforce UUID names and try to organize by folder
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      beforeCreate(event) {
        const { data } = event.params;
        
        // Replace the random Strapi hash with a UUID
        const newUuid = uuidv4();
        data.hash = newUuid;
        
        // If uploaded to a specific folder in Strapi admin, we prepend it to the path.
        // If not, we put it in a generic UUID directory to avoid S3 root clutter
        const folderPrefix = data.folderPath && data.folderPath !== '/' 
          ? data.folderPath.replace(/^\//, '') // removes leading slash
          : 'general';
          
        // The S3 provider uses `hash` or `path` + `hash`. Let's force the S3 path:
        // By changing `url` or `hash`, the S3 provider reacts.
        // Actually, the S3 provider uses `file.path` if present before `file.hash`.
        data.path = `${folderPrefix}/${newUuid}`;
      },
    });
  },
};
