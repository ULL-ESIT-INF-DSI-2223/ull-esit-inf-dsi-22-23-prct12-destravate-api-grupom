# USUARIO

```typescript
  username: string;
  name: string;
  activity: 'Correr' | 'Bicicleta';
  friends?: Schema.Types.ObjectId[];
  friendsGroups?: Schema.Types.ObjectId[];
  trainingStats?: UserStats;
  favoriteTracks?: Schema.Types.ObjectId[];
  favoriteChallenges?: Schema.Types.ObjectId[];
  history?: Map<string, Schema.Types.ObjectId[]>;
```

## creas un usuario y agrega un amigo --> se tienen que actualizar los dos vectores de los dos usuarios
username, name, friends
IMPLEMENTADO
TESTEADO

## al actualizar un usuario y quitar un amigo se debe quitar en el vector del amigo al propio usuario 
friends --> quitar
IMPLEMENTADO
TESTEADO LOS DOS TIPOS

## al actualizar un usuario y agrega un amigo y se debe añadir tambien en el array del amigo al propio usuario 
friends --> añadir
IMPLEMENTADO
TESTEADO LOS DOS TIPOS

## al eliminar un usuario si tiene amigos, deberia desparecer para todo
eliminar usuario de todas las listas friends de cada amigo que tenía
IMPLEMENTADO
TESTEADO

------------------------

## un usuario se crea y se añade a un grupo, deberia estar actualizado su friendsGroups y en el determinado grupo deberia aparecer los participants dicho usuario
IMPLEMENTADO
TESTEADO

## un usuario se actualiza y se añade a un grupo, se deberia actualizar el vector de partticipantes del grupo
IMPLEMENTADO
TESTEADO LOS DOS TIPOS

## un usuario se actualiza y se elimina de un grupo, se deberia actualizar el vector de partticipantes del grupo
IMPLEMENTADO
TESTEADO LOS DOS TIPOS

## un usuario se elimina y se elimina de sus grupos, se deberian actualizar los vectores de partticipantes de los grupos
IMPLEMENTADO
TESTEADO

------------------------


## si tenemos un usuario en users y ese usuario se elimina, se debe borrar tambien de users en challenge
IMPLEMENTADO
TESTEADO PARA LOS DOS


------------------------

# GRUPO

```typescript
  id: number;
  name: string;
  participants?:  Schema.Types.ObjectId[];
  groupTrainingStats?: UserStats;
  groupRanking: Schema.Types.ObjectId[];
  groupFavoriteTracks?: Schema.Types.ObjectId[];
  groupHistoricalTracks?: Map<string, Schema.Types.ObjectId[]>;
```

## Al crear un grupo si se introducen participantes, estos deben aparecer en el vector de friendsGroups de cada participante
IMPLEMENTADO
TESTEADO

## Al actualizar un grupo si se introducen participantes, estos deben aparecer en el vector de friendsGroups de cada participante
IMPLEMENTADO
TESTEADO LOS DOS TIPOS

## Al actualizar un grupo si se encuentran participantes, estos deben desaparecer en el vector de friendsGroups de cada participante
IMPLEMENTADO
TESTEADO LOS DOS TIPOS

## Al eliminar un grupo si se encuentran participantes, estos deben desaparecer en el vector de friendsGroups de cada participante
IMPLEMENTADO
TESTEADO



------------------------


# TRACK

```typescript
  id: number,
  name: string,
  startGeolocation: Coordinates,
  endGeolocation: Coordinates,
  distance: number,
  unevenness: number,
  users?: Schema.Types.ObjectId[],
  activity: 'Bicicleta' | 'Correr',
  averageRating?: number
```

## si tenemos una ruta en tracks de challenge y esa ruta se elimina, se deberia borrar tambien de tracks en challenge
IMPLEMENTADO
TESTEADO

## si creamos una ruta y le metemos usuarios, debe aparecer en el historico del usuario

NO TESTEADO

## si actualizamos una ruta y agregamos usuarios debe aparecer en el historico del usuario

NO TESTEADO

## si actualizamos una ruta y eliminamos usuarios debe desaparecer en el historico del usuario

NO TESTEADO

## si eliminamos una ruta debe desaparecer del historico del usuario

NO TESTEADO


------------------------


# CHALLENGE

```typescript
  id: number;
  name: string;
  tracks: Schema.Types.ObjectId[];
  activity: "Bicicleta" | "Correr";
  totalDistance?: number;
  users?: Schema.Types.ObjectId[];
```


## si creamos un reto, no pasa nada con el vector de usuarios, tampoco pasa nada con el vector de tracks
IMPLEMENTADO
TESTEADO


## si eliminamos un reto, no pasa nada con el vector de usuarios, tampoco pasa nada con el vector de tracks
IMPLEMENTADO
TESTEADO