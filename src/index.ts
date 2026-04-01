import { v4 as uuidv4 } from 'uuid';

export default {
  /**
   * Se ejecuta antes de que la aplicación se inicialice.
   * Mantiene la lógica de rutas personalizadas para S3.
   */
  register({ strapi }) {
    const providerService = strapi.plugin('upload').service('provider');
    const originalUpload = providerService.upload;

    providerService.upload = async (file, customConfig) => {
      // Si el archivo tiene una ruta de carpeta en la Media Library, la usamos para S3
      if (file.folderPath && file.folderPath !== '/') {
        // Limpiamos el slash inicial para evitar rutas como bucket//carpeta/archivo
        file.path = file.folderPath.replace(/^\//, '');
      }
      return originalUpload.call(providerService, file, customConfig);
    };
  },

  /**
   * Se ejecuta cuando la aplicación arranca.
   * Implementamos el hook de borrado físico para S3.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],

      async beforeDelete(event) {
        const { where } = event.params;

        try {
          // 1. Buscamos el archivo en la DB antes de que Strapi lo elimine
          const file = await strapi.plugin('upload').service('upload').findOne(where.id);

          if (file && file.provider === 'aws-s3') {
            // 2. Forzamos al proveedor S3 a eliminar el archivo físico
            // Al pasarle el objeto 'file' completo, Strapi conoce la ruta (path) y el hash
            await strapi.plugin('upload').service('provider').delete(file);

            console.log(`[S3 Cleanup] Borrado físico solicitado para: ${file.url}`);
          }
        } catch (error) {
          console.error(`[S3 Error] Error al intentar borrar el archivo físico en AWS:`, error);
        }
      },
    });
  },
};