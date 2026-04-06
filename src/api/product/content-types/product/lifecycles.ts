import { v4 as uuidv4 } from 'uuid';

export default {
  beforeCreate(event) {
    const { data } = event.params;

    // Si no trae un uuid, le asignamos uno automáticamente generado
    if (!data.uuid) {
      data.uuid = uuidv4();
    }
  },

  beforeUpdate(event) {
    // Para hacer de facto "Read-Only" la integridad de la llave.
    // Si se envía desde el panel administrativo o API, lo ignoramos para 
    // que nadie pueda sobreescribir el uuid por error.
    if (event.params.data && event.params.data.uuid !== undefined) {
      delete event.params.data.uuid;
    }
  }
};