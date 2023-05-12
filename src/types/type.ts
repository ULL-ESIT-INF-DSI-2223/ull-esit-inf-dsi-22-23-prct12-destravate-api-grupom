
/**
 * Tipo que define como serepresenta las estadisticas de desnivel y distancia
 * @typedef {Array} UnevennessDistance
 * @property {number} unevenness - Desnivel
 * @property {number} distance - Distancia
 * @example [100, 1000]
 */
export type UnevennessDistance = [unevenness: number, distance: number];

/**
 * Tipo que define como se representan las estadisticas de desnivel y distancia
 * por semana, mes y año
 * @typedef {Array} Stats
 * @property {UnevennessDistance} week - Estadisticas de la semana
 * @property {UnevennessDistance} month - Estadisticas del mes
 * @property {UnevennessDistance} year - Estadisticas del año
 * @example [[100, 1000], [100, 1000], [100, 1000]]
 */
export type Stats = [week: UnevennessDistance, month: UnevennessDistance, year: UnevennessDistance];


/**
 * Tipo que define como se representan las coordenadas
 * @typedef {Array} Coordinates
 * @property {number} latitude - Latitud
 * @property {number} length - Longitud
 * @example [100, 1000]
 */
export type Coordinates = [latitude: number, length: number];