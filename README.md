# Práctica 12 - Destravate: API Node/Express
## Desarollado por Facundo García Gallo y Daniel Felipe Gómez


<p align="center">
  <a href="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupom/actions/workflows/node.js.yml">
    <img alt="Tests" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupom/actions/workflows/node.js.yml/badge.svg">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupom/actions/workflows/coveralls.yml">
    <img alt="Coveralls" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupom/actions/workflows/coveralls.yml/badge.svg">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupom/actions/workflows/sonarcloud.yml">
    <img alt="Sonar-Cloud" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupom/actions/workflows/sonarcloud.yml/badge.svg">
  </a>
</p>

## Indice

- [Introducción](#introducción)

- [Pasos previos](#pasos-previos)

- [Idea General](#idea-general)

- [Estructura del proyecto](#estructura-del-proyecto)

- [Models](#models)

- [Routers](#routes)

- [Tools](#tools)

- [Types](#types)

- [Tests](#tests)

- [Documentación](#documentación)

- [Conclusiones](#conclusiones)

- [Referencias](#referencias)



## Introducción

Para la última práctica de la asignatura de Desarrollo de Sistemas Informáticos, se nos solicita implementar una API REST con Node.js y Express. Esta API debe ser capaz de gestionar una base de datos de 4 modelos diferentes los cuales componen una aplicación de rutas en bicicleta o corriendo, los modelos son los siguientes:

- **User** - Usuarios de la aplicación

- **Track** - Rutas de los usuarios

- **Challenge** - Retos de los usuarios

- **Group** - Grupos de usuarios

Las relaciones y elementos que componen a los modelos se corresponde a la ya trabajada en la anterior práctica de grupo. Sin embargo, más adelante se expondrán nuevamente.

Para la gestión de la base de datos se ha utilizado **MongoDB** y **Mongoose**. Además como ya se acostumbra se hará uso de **Mocha** y **Chai** para la realización de los tests, y se utilizará **Sonar Cloud** para la comprobación de la calidad del código.


## Pasos previos

Antes de enfrentar la realización de la práctica debemos tener instaladas las correspondientes herramientas. Para ello, se recomienda revisar los [apuntes referentes a MongoDB](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-mongodb.html) donde se explica como instalar y configurar MongoDB. También sería comveniente revisar los [apuntes referentes a Mongoose](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-mongoose.html) donde se explica como instalar y configurar Mongoose.

Por último para el desarrollo de la API podemos apoyarnos de los [apuntes referentes a el desarrollo de API REST](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-rest-api.html) donde se explica como desarrollar una API REST con Node.js y Express.

## Idea General

Para el desarrollo de la API definiremos los esquemas correspondeintes a cada uno de las entidades que pretendemos modelar en la base de datos y crearemos una colección para cada una. Debemos tener presente que pretendemos que la API sea capaz de gestionar los siguientes modelos y sus correspondientes operaciones en la base de datos:

- **User** - Usuarios de la aplicación

  - Crear un usuario
  - Obtener todos los usuarios
  - Obtener un usuario por su username
  - Actualizar un usuario por su username
  - Eliminar un usuario por su username

- **Track** - Rutas de los usuarios

  - Crear una ruta
  - Obtener todas las rutas
  - Obtener una ruta por su id
  - Actualizar una ruta por su id
  - Eliminar una ruta por su id

- **Challenge** - Retos de los usuarios

  - Crear un reto
  - Obtener todos los retos
  - Obtener un reto por su id
  - Actualizar un reto por su id
  - Eliminar un reto por su id

- **Group** - Grupos de usuarios

  - Crear un grupo
  - Obtener todos los grupos
  - Obtener un grupo por su id
  - Actualizar un grupo por su id
  - Eliminar un grupo por su id

En el siguiente apartado se explicará la estructura del proyecto y como se ha implementado cada uno de los modelos y sus correspondientes operaciones.


## Estructura del proyecto

A medida que el proyecto crecía nos dimos cuenta que la modularidad sería un factor imprescindible para poder mantener el código de una forma ordenada y limpia. Por ello, decidimos separar el código en diferentes carpetas y archivos. A continuación se explicará la estructura del proyecto y el contenido de cada uno de los archivos.

```
.src
├── app.ts
├── server.ts
├── db
│   └── mongoose.ts
├── models
│   ├── challengeModel.ts
│   ├── groupModel.ts
│   ├── trackModel.ts
│   └── userModel.ts
├── routers
│   ├── challengeRouter.ts
│   ├── groupRouter.ts
│   ├── trackRouter.ts
│   ├── userRouter.ts
│   ├── user
│   │   ├── get.ts
│   │   ├── post.ts
│   │   ├── patch.ts
│   │   └── delete.ts
│   ├── track
│   │   ├── get.ts
│   │   ├── post.ts
│   │   ├── patch.ts
│   │   └── delete.ts
│   ├── challenge
│   │   ├── get.ts
│   │   ├── post.ts
│   │   ├── patch.ts
│   │   └── delete.ts
│   └── group
│       ├── get.ts
│       ├── post.ts
│       ├── patch.ts
│       └── delete.ts
├── tools
│   └── tools.ts
└── types
    └── types.ts
.test
└── routers
    ├── challengeRouter.spec.ts
    ├── groupRouter.spec.ts
    ├── trackRouter.spec.ts
    └── userRouter.spec.ts
```

Para conseguir la división de los verbos HTTP en ficheros fue todo un reto debido a que se debe indicar en su correrpondiente fichero **router** que existe un controlador para determinada operación. Por ejemplo, en el fichero **userRouter.ts** se indica que existe un controlador para la operación GET, POST, PATCH y DELETE. Para ello, se ha utilizado el siguiente código:

```typescript
// src/routers/userRouter.ts
userRouter.post("/users", postUser)
userRouter.get("/users", getUserQuery)
userRouter.get("/users/:username", getUser)
userRouter.patch("/users", patchUserQuery)
userRouter.patch("/users/:username", patchUser)
userRouter.delete("/users", deleteUserQuery)
userRouter.delete("/users/:username", deleteUser)
```

Como podemos ver definimos la ruta y el controlador que se ejecutará en cada una de las operaciones. Unos apartados más adelante se explicará como se ha implementado cada uno de los controladores.


## Models

En el correspondiente dichero de un modelo se define el esquema que tendrá la colección en la base de datos. Para ello, se ha utilizado la librería **Mongoose**. Además para añadir el control de el tipado creamos una interfaz que se corresponde con el esquema de la colección y la cual extiende de Document de Mongoose. A continuación se muestra un ejemplo de un modelo:

```typescript
// src/models/userModel.ts
export interface ChallengeDocumentInterface extends Document {
  id: number;
  name: string;
  tracks: Schema.Types.ObjectId[];
  activity: "Bicicleta" | "Correr";
  totalDistance?: number;
  users?: Schema.Types.ObjectId[];
}

const ChallengeSchema = new Schema<ChallengeDocumentInterface>({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error("El nombre de un reto debe comenzar con mayúscula");
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error("Solo se aceptan caracteres alfanuméricos");
      }
    },
  },
  tracks: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Track",
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await TracksExist(id);
      }
    }
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Bicicleta"],
  },
  totalDistance: {
    type: Number,
    default: 0,
  },
  users: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
    validate: async (value: Schema.Types.ObjectId[]) => {
      for (const id of value) {
        await UsersExist(id);
      }
    }
  },
});
```

Como podemos ver la interfaz que definimos debemos procurar añadir todos los elementos necesarios en el esquema de Mongoose para que se correspondan entre si. Además, podemos añadir validaciones para los campos que necesitemos. En este caso, hemos añadido validaciones para el campo **name** y **tracks**. Para el campo **name** hemos añadido una validación para que el nombre comience con mayúscula y solo se acepten caracteres alfanuméricos. Para el campo **tracks** hemos añadido una validación para comprobar que los ids de las rutas existen en la base de datos. Para ello, hemos creado una función que comprueba si existe una ruta con el id que le pasamos como parámetro. En caso de que no exista lanza un error. A continuación se muestra el código de la función:

```typescript
// src/tools/tools.ts
export const TracksExist = async (id: Schema.Types.ObjectId) => {
  const tracks = await Track.findOne({ _id: id });
  if (tracks === null) {
    throw new Error('No existe ninguna ruta con ese id');
  }
  return true;
};
```

En la función nos encargamos, mediante una consulta a la base de datos de Track, de comprobar que existe el **id** pasado como parámetro y en caso de que no exista lanzamos un error. En caso de que exista devolvemos **true**. De esta forma, podemos añadir la validación en el campo **tracks** del esquema de Mongoose.



## Routers

Como ya se menciono en apartados anteriores, hemos realizado una modulación total de los verbos de cada modelo para permitir mejor mantenimiento del código y permitir que sea escalable. Si nos centramos entonces en cada una de las operaciones, tomaremos **User** como referencia. En el fichero **userRouter.ts** se definen las rutas y los controladores que se ejecutarán en cada una de las operaciones. A continuación se muestra el código:

```typescript
// src/routers/userRouter.ts
userRouter.post("/users", postUser)
userRouter.get("/users", getUserQuery)
userRouter.get("/users/:username", getUser)
userRouter.patch("/users", patchUserQuery)
userRouter.patch("/users/:username", patchUser)
userRouter.delete("/users", deleteUserQuery)
userRouter.delete("/users/:username", deleteUser)
```

Veamos entonces como se ha implementado cada uno de los routers.

### POST

```typescript
// src/routers/user/post.ts	
export const postUser = async (req: any, res: any) => {
  try {

    const user = new User(req.body);
  
    // ACTUALIZA: Se encarga de mantener sincronizados los usuarios de rutas, con las rutas de usuarios
    if (user.history !== undefined) {
      const values = [...new Set([...(user.history.values())].flat())];
      for (let i = 0; i < values.length; i++) {
        await Track.findOneAndUpdate({ _id: values[i] }, { $addToSet: { users: user._id }});
      }
    }
  
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    if(user.friendsGroups !== undefined) {
      for(let i = 0; i < user.friendsGroups.length; i++) {
        await Group.findOneAndUpdate({ _id: user.friendsGroups[i] }, { $addToSet: { participants: user._id }});
      }
    }
  
    // ACTUALIZA: Se encarga de mantener sincronizados los amigos de un usuario
    if(user.friends !== undefined) {
      for(let i = 0; i < user.friends.length; i++) {
        await User.findOneAndUpdate({ _id: user.friends[i] }, { $addToSet: { friends: user._id }});
      }
    }
    await user.save();

    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (user.history !== undefined) {
      const rutas = Array.from(user.history.values()).flat();
      for(let i = 0; i < rutas.length; i++) {
        const ruta = await Track.findById(rutas[i]);
        if(ruta !== null) {
          estadisticas[0][0] += ruta.unevenness;
          estadisticas[0][1] += ruta.distance;
          estadisticas[1][0] += ruta.unevenness;
          estadisticas[1][1] += ruta.distance;
          estadisticas[2][0] += ruta.unevenness;
          estadisticas[2][1] += ruta.distance;
        }
      }
    }
    
    await User.findByIdAndUpdate(user._id , { trainingStats: estadisticas });
    const userActualizado = await User.findById(user._id);

    return res.status(201).send(userActualizado);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el usuario", error: error});
  }
};
```

Como podemos ver se define el controlador asíncrono **postUser** que se encarga de añadir un usuario a la base de datos. Para ello, se crea un objeto de tipo **User** con los datos que se le pasan en el cuerpo de la petición. A continuación, se comprueba si el usuario tiene rutas en su historial, en caso de que tenga se actualizan las rutas para que apunten al usuario. De igual forma, se comprueba si el usuario tiene grupos de amigos, en caso de que tenga se actualizan los grupos para que apunten al usuario. Se comprueba si el usuario tiene amigos, en caso de que tenga se actualizan los amigos para que apunten al usuario. 

Por último, se actualiza las estadísticas del usuario. Una vez se han actualizado todos los datos se guarda el usuario en la base de datos y se devuelve el usuario actualizado.

**IMPORTANTE ->** Con las correspondientes verificaciones que se realizan para mantener al usuario actualizado nos aseguramos de la integridad de los datos en todos los modelos que se relacionan con el modelo **User**.


### GET

Para el método **GET** se han definido dos formas de obtener los usuarios. La primera froma se basa en querys y la segunda forma se basa en parámetros de la ruta. A continuación se muestra el código de ambas formas:

```typescript
// src/routers/user/get.ts
export const getUserQuery =  async (req: any, res: any) => {
  try {
    const filter = req.query.username ? {username: req.query.username.toString()} : {};

    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.status(200).send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};


export const getUser =  async (req: any, res: any) => {

  try {
    const filter = req.params.username ? {username: req.params.username.toString()} : {};

    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.status(200).send(users);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};
```

Como podemos ver, en ambos casos se define un controlador asíncrono que se encarga de obtener los usuarios de la base de datos. En el caso de **getUserQuery** se obtienen los usuarios que coincidan con el nombre de usuario que se pasa en la query. En el caso de **getUser** se obtienen los usuarios que coincidan con el nombre de usuario que se pasa en la ruta. En ambos casos se devuelve un array con los usuarios que coincidan con el filtro. Para controlar la posibilidad de solicitud de todos los usuarios usamos un operados ternario en el filtro, donde en caso de no definirse ningún **username** se devuelve un objeto vacío, de esta forma se obtienen todos los usuarios.


### PATCH

Nuevamente hemos desarrollado dos formas de actualizar los usuarios. La primera forma se basa en querys y la segunda forma se basa en parámetros de la ruta. Sin embargo, para simplificar la explicación expondremos una sola en el informe, ya que ambas son muy similares.

```typescript
export const patchUserQuery =  async (req: any, res: any) => {
  if (!req.query.username) {
    return res.status(400).send({ error: 'A username must be provided' });
  }

  try {
    const allowedUpdates = ["name", "activity", "friends", "friendsGroups", "history"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar"});
    }

    // Usuario antes de ser modificado
    const userActual = await User.findOne({ username: req.query.username });
    const arrayGruposAntes = userActual?.friendsGroups;
    const arrayAmigosAntes = userActual?.friends;

    // Usuario después de ser modificado
    const user = await User.findOneAndUpdate({ username: req.query.username }, req.body, { new: true, runValidators: true, });
    const arrayGruposDespues = user?.friendsGroups;
    const arrayAmigosDespues = user?.friends;

    // ACTUALIZA: Se encarga de mantener sincronizados el atributo friendsGroups de los usuarios
    if (arrayGruposAntes !== undefined && arrayGruposDespues !== undefined && user) {
      const diferenciaGrupos = arrayGruposAntes.filter((group) => !arrayGruposDespues.includes(group));
      if (diferenciaGrupos.length !== 0) {
        for(let i = 0; i < diferenciaGrupos.length; ++i) {
          await Group.findOneAndUpdate({ _id: diferenciaGrupos[i] }, { $pull: { participants: user._id }});
        }
      }
    }

    // ACTUALIZA: Se encarga de mantener sincronizados el atributo friends de los usuarios
    if (arrayAmigosAntes !== undefined && arrayAmigosDespues !== undefined && user) {
      const diferenciaAmigos = arrayAmigosAntes.filter((friend) => !arrayAmigosDespues.includes(friend));
      if (diferenciaAmigos.length !== 0) {
        for(let i = 0; i < diferenciaAmigos.length; ++i) {
          await User.findOneAndUpdate({ _id: diferenciaAmigos[i] }, { $pull: { friends: user._id }});
        }
      }
    }

    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios de rutas, con las rutas de usuarios
    if (user && user.history !== undefined) {
      const values = [...new Set([...(user.history.values())].flat())];
      for (let i = 0; i < values.length; i++) {
        await Track.findOneAndUpdate({ _id: values[i] }, { $addToSet: { users: user._id }});
      }
    }
    
    // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    if(user && user.friendsGroups !== undefined) {
      for(let i = 0; i < user.friendsGroups.length; i++) {
        await Group.findOneAndUpdate({ _id: user.friendsGroups[i] }, { $addToSet: { participants: user._id }});
      }
    }
  
    // ACTUALIZA: Se encarga de mantener sincronizados los amigos de un usuario
    if(user && user.friends !== undefined) {
      for(let i = 0; i < user.friends.length; i++) {
        await User.findOneAndUpdate({ _id: user.friends[i] }, { $addToSet: { friends: user._id }});
      }
    }

    // ACTUALIZA: las estadísticas del usuario
    let estadisticas: Stats = [[0,0],[0,0],[0,0]]
    if (user && user.history !== undefined) {
      const rutas = Array.from(user.history.values()).flat();
      for(let i = 0; i < rutas.length; i++) {
        const ruta = await Track.findById(rutas[i]);
        if(ruta !== null) {
          estadisticas[0][0] += ruta.unevenness;
          estadisticas[0][1] += ruta.distance;
          estadisticas[1][0] += ruta.unevenness;
          estadisticas[1][1] += ruta.distance;
          estadisticas[2][0] += ruta.unevenness;
          estadisticas[2][1] += ruta.distance;
        }
      }
      await User.findByIdAndUpdate(user._id , { trainingStats: estadisticas });
    }
    
    const userActualizado = await User.findOne({username: req.query.username});

    if (userActualizado) {
      return res.send(userActualizado);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};
```

Primeramente nos aseguramos que se nos proporcione un **username** para poder encontrar un usuario de forma única, posteriormente encerramos dentro de un **try-catch** las correspondientes operaciones.

En la primera parte del código nos encargamos de comprobar que los parámetros que se nos proporcionan para actualizar el usuario son válidos. Para ello, comprobamos que los parámetros que se nos proporcionan se encuentran dentro de un array de parámetros permitidos. En caso de que no sea así, devolvemos un error 400.

Con el fin de mantener sincronizado los datos entre modelos nos encargamos de actualizar el usuario. Para ello, utilizamos la función **findOneAndUpdate** de mongoose. Esta función recibe tres parámetros: el primero es el filtro que se va a aplicar para encontrar el usuario que se quiere actualizar, el segundo es el cuerpo de la petición que contiene los parámetros que se quieren actualizar y el tercero es un objeto que contiene dos parámetros: **new** y **runValidators**. El primero de ellos indica que se devuelva el usuario actualizado y el segundo indica que se ejecuten las validaciones que se han definido en el modelo del usuario.

En la tercera parte del código nos encargamos de mantener sincronizados los atributos **friendsGroups** y **friends** del usuario. Para ello, comprobamos que los atributos antes de ser modificados y los atributos después de ser modificados no son **undefined**. En caso de que no sean **undefined**, comprobamos que los atributos antes de ser modificados y los atributos después de ser modificados no son iguales. En caso de que no sean iguales, se recorre el array de atributos antes de ser modificados y se comprueba que el atributo no se encuentra en el array de atributos después de ser modificados. En caso de que no se encuentre, se recorre el array de atributos antes de ser modificados y se actualizan los atributos de los grupos y de los amigos del usuario.

En la cuarta parte del código nos encargamos de mantener sincronizados los atributos **history** de los usuarios con los atributos **users** de las rutas. Para ello, comprobamos que el usuario no es **undefined** y que el atributo **history** del usuario no es **undefined**. En caso de que no sean **undefined**, se recorre el array de rutas del usuario y se actualizan los atributos **users** de las rutas. 

A continuación nos encargamos de mantener sincronizados los atributos **friendsGroups** del usuario con los atributos **participants** de los grupos y los atributos **friends** del usuario con los atributos **friends** de los usuarios. Para ello, comprobamos que el usuario no es **undefined** y que el atributo **friendsGroups** del usuario no es **undefined**. En caso de que no sean **undefined**, se recorre el array de grupos del usuario y se actualizan los atributos **participants** de los grupos y los atributos **friends** de los usuarios.

En la sexta parte del código nos encargamos de actualizar las estadísticas del usuario. Para ello, comprobamos que el usuario no es **undefined** y que el atributo **history** del usuario no es **undefined**. En caso de que no sean **undefined**, se recorre el array de rutas del usuario y se actualizan las estadísticas del usuario.

Finalmente, nos encargamos de devolver el usuario actualizado. Para ello, comprobamos que el usuario no es **undefined**. En caso de que no sea **undefined**, devolvemos el usuario actualizado. En caso de que sea **undefined**, devolvemos un error 404. Es importante asegurarnos que de devolver siempre el usuario con las modificaciones ya realizadas para mantener informado correctamente al cliente de las modificaciones que se han realizado.



### DELETE

```typescript
// src/routers/user/delete.ts
export const deleteUserQuery =  async (req: any, res: any) => {
  if (!req.query.username) {
    return res.status(400).send({ error: 'A username must be provided' });
  }
   try {
    const user = await User.findOne({username: req.query.username.toString()});
     if (!user) {
      return res.status(404).send();
    }

    await User.updateMany( { friends: user._id }, { $pull: { friends: user._id }});

     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Group.updateMany({ participants: user._id }, { $pull: { participants: user._id }});

     // ACTUALIZA: Se encarga de mantener sincronizados los ususarios con los grupos y los grupos con los usuarios
    await Challenge.updateMany({ users: user._id }, { $pull: { users: user._id }});

    await User.findByIdAndDelete(user._id);
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};
```

Primeramente nos aseguramos que se nos proporcione un **username** para poder encontrar un usuario de forma única, posteriormente encerramos dentro de un **try-catch** las correspondientes operaciones.

Primeramente obtenemos el usuario que se quiere eliminar. Para ello, utilizamos la función **findOne** de mongoose. Esta función recibe un parámetro que es el filtro que se va a aplicar para encontrar el usuario que se quiere eliminar.

Debemos asegurarnos de borrar el usuario y sus correspondientes apariciones en otros modelos. Para ello, utilizamos la función **updateMany** de mongoose. Esta función recibe dos parámetros: el primero es el filtro que se va a aplicar para encontrar los modelos que se quieren actualizar y el segundo es el cuerpo de la petición que contiene los parámetros que se quieren actualizar. En este caso, se encarga de eliminar el usuario de los atributos **friends** de los usuarios, de los atributos **participants** de los grupos y de los atributos **users** de los retos.


# Tools

Como ya la expusimos en apartados anteriores, hemos desarrollado un controlador que se encarga de verificar si una determinada **id** pertenece a un modelo de mongoose. 

```typescript
export const UsersExist = async (id: Schema.Types.ObjectId) => {
  const users = await User.findOne({ _id: id });
  if (users === null) {
    throw new Error('No existe ningún usuario con ese id');
  }
  return true;
}

export const GroupsExist = async (id: Schema.Types.ObjectId) => {
  const groups = await Group.findOne({ _id: id });
  if (groups === null) {
    throw new Error('No existe ningún grupo con ese id');
  }
  return true;
}


export const ChallengesExist = async (id: Schema.Types.ObjectId) => {
  const challenge = await Challenge.findOne({ _id: id });
  if (challenge === null) {
    throw new Error('No existe ningún reto con ese id');
  }
  return true;
}
  
export const TracksExist = async (id: Schema.Types.ObjectId) => {
  const tracks = await Track.findOne({ _id: id });
  if (tracks === null) {
    throw new Error('No existe ninguna ruta con ese id');
  }
  return true;
}
```

En el caso de que no exista ningún modelo con la **id** proporcionada, se lanza un error. En caso contrario, se devuelve **true**.


## Types

En este apartado se encuentran los tipos de datos que se utilizan en el proyecto. 

```typescript

export type UnevennessDistance = [unevenness: number, distance: number];

export type Stats = [week: UnevennessDistance, month: UnevennessDistance, year: UnevennessDistance];

export type Coordinates = [latitude: number, length: number];
```

Estos se corresponden a los usados en la práctica anterior de **Destravate**.

## Middlewares

Nos parece interesante comentar que nos aventuramos a estudiar el funcionamiento de los middlewares de Mongoose. Estos se ejecutan antes de que se ejecute una determinada función. En nuestro caso, nos interesaba que se ejecutara antes de que se ejecutara la función **save** de un modelo de mongoose. Para ello, utilizamos la función **pre** de mongoose. Esta función recibe dos parámetros: el primero es el nombre de la función que se quiere ejecutar y el segundo es la función que se quiere ejecutar. En nuestro caso, queremos ejecutar la función **save** y la función que se va a ejecutar es la siguiente:

```typescript	

UserSchema.pre('save', function(next) {  
  const contador = new Map<string, number>();
  if (this.history !== undefined) {
    this.history.forEach((value) => {
      for (let i = 0; i < value.length; i++) {
        if (contador.has(value[i].toString()) && contador.get(value[i].toString()) !== undefined) {
          const actual = contador.get(value[i].toString());
          if (actual !== undefined) {
            contador.set(value[i].toString(), actual + 1);
          }
        } else {
          contador.set(value[i].toString(), 1);
        }
      } 
    });
  }
  const ordenado = new Map([...contador.entries()].sort((a, b) => b[1] - a[1]));
  for (const key of ordenado.keys()) {
    this.favoriteTracks?.push((key as unknown) as Schema.Types.ObjectId);
  }
  next();
});
```

Gracias a este Middleware, podemos actualizar el atributo **favoriteTracks** de un usuario cada vez que se ejecute la función **save**. Para ello, utilizamos un **Map** que se encarga de contar las apariciones de cada **id** de una ruta en el atributo **history** de un usuario. Una vez que tenemos el **Map** ordenado, actualizamos el atributo **favoriteTracks** con las **id** de las rutas que más veces han aparecido en el atributo **history** de un usuario.

## Tests

Para poder llevar a cabo los test de la aplicación sin la necesidad de tener el servidor en funcionamiento, hemos utilizado la librería **supertest**. Para ello, seguimos las refactorizaciones de código propuestas en [los apuntes de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-rest-api-testing.html).

Si se sigue correctamente los pasos de los apuntes, se debería conseguir una base de datos exclusiva para los test. Por último debemos tener presente que para los test usaremos **async/await** en lugar de **done**. Además de **request** de **supertest**.

Posteriormente los test hemos decidido hacer una serie de casos de uso donde se presentaran todo tipo de operaciones para poder evaluar de la mejor forma a nuestra API. Cabe destacar que hicimos uso del operador **before** que nos ofrece **mocha** para limpiar la base de datos antes de empezar a desarrollar los test. De esta forma nos aseguramos arrancar siempre con una base de datos limpia y sin datos que puedan interferir en los test.


Podemos ver algunos ejemplos de estos test a continuación:

```typescript
describe('POST /users', () => {
  it('Un usuario se crea con los parámetros mínimos correctamente', async () => {
    const ruta = await request(app).post('/tracks').send({
      id: 1,
      name: "RutaFondoBiKini",
      startGeolocation: [0,0],
      endGeolocation: [1,1],
      distance: 3,
      unevenness: 4,
      activity: "Correr",
      users: []
    });
    
    const response = await request(app).post('/users').send({
      name: "Bob Esponja",
      username: "bobesponja",
      history: {"01-01-2023": [ruta.body._id]}
    }).expect(201);
    
    expect(response.body).to.include({
      name: 'Bob Esponja',
      username: 'bobesponja'
    });
    
    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).not.to.be.null;
    expect(checkFirstUser!.username).to.equal('bobesponja');   
    expect(response.body.history).to.deep.equal({"01-01-2023": [ruta.body._id]});
    expect(response.body.trainingStats).to.eql([[4,3], [4,3], [4,3]]);
  });

  it('Si se intenta crear un nuevo usuario con el mismo username falla', async () => {
    const response = await request(app).post('/users').send({
      name: "Bob Esponja",
      username: "bobesponja"
    }).expect(500);

    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).to.be.null;
  });

  it('Un usuario se crea con los parámetros mínimos correctamente', async () => {
    const BobEsponja = await User.findOne({username: 'bobesponja'});
    let idBobEsponja = "";
    if(BobEsponja !== null) {
      idBobEsponja = BobEsponja._id.toString();
    }

    const response = await request(app).post('/users').send({
      name: "Patricio Estrella",
      username: "patricio",
      activity: "Bicicleta",
      friends: [idBobEsponja],
    }).expect(201);

    expect(response.body).to.include({
      name: 'Patricio Estrella',
      username: 'patricio',
      activity: 'Bicicleta'
    });
    expect(response.body.friends).to.eql([idBobEsponja]);
    expect(response.body.friendsGroups).to.eql([]);
    expect(response.body.trainingStats).to.eql([[0,0], [0,0], [0,0]]);
    expect(response.body.favoriteTracks).to.eql([]);
    expect(response.body.favoriteChallenges).to.eql([]);
    expect(Array.from(response.body.history)).to.deep.equal([]);

  
    const checkFirstUser = await User.findById(response.body._id);
    expect(checkFirstUser).not.to.be.null;
    expect(checkFirstUser!.username).to.equal('patricio');
  });
});
```


## Conclusiones

Sin duda alguna es una alegría terminar el proyecto con éxito. La asignatura de DSI ha sido toda una experiencia para nosotros, donde hemos aprendido una gran cantidad de herramientas e ideas de desarrollo. Después de hablarlo mucho, consideramos que es la asignatura que más conocimientos previos requiere, pero a su vez es la que más conocienminetos te aporta. 

Tras un cuatrimestre de apreduzaje debemos reconocer que es la asignatura que más nos ha gustado y que más nos ha aportado. De cierta forma, nos demuestra lo mucho que nos falta para salir al sector laborar, pero a la vez nos demuestra lo amueblada que tenemos la cabeza de cientos de conceptos.

La práctica como tal ha sido bastante agradable y nos ha obligado en muchas ocasiones a tomar papel y lapz y modelar todas las relaciones y direcciones que tomaba y consideramos que ese proceso es el que nos diferencia de los alumnos que eramos en primer año.

Por último, nos gustaría agradecer a los profesores de la asignatura por su dedicación y por su esfuerzo en hacer la asignatura tan interesante y amena. Aplaudimos el hecho de no plantear un aburrido examen final y en su lugar recompenzar el trabajo y esfuerzo que ha requerido la asignatura a lo largo del cuatrimestre.

## Referencias

- [MongoDB](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-mongodb.html)

- [Mongoose](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-mongoose.html)

- [API REST](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-rest-api.html)

- [SuperTest](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-rest-api-testing.html)
