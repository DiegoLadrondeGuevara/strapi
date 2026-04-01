import { v4 as uuidv4 } from 'uuid';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register({ strapi }) {
    // Intercept upload to inject folderPath into the file's path before S3 provider receives it
    const providerService = strapi.plugin('upload').service('provider');
    const originalUpload = providerService.upload;
    
    providerService.upload = async (file, customConfig) => {
      // file.folderPath contains the Media Library folder (e.g. "/banners" or "/products/cakes")
      if (file.folderPath && file.folderPath !== '/') {
        // The S3 provider natively prepends file.path to the final S3 key
        // We strip the leading slash to prevent double slashes in S3
        file.path = file.folderPath.replace(/^\//, ''); 
      }
      return originalUpload.call(providerService, file, customConfig);
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap({ strapi }) {
    // Other logic if necessary
  },
};
