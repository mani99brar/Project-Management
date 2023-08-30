
const Project = require('../models/Project.js');
const Client = require('../models/Client.js');

//Used to create a type for different resources like projects clients etc.
const {GraphQLObjectType,GraphQLID,GraphQLString,GraphQLSchema,GraphQLList} = require('graphql');

//Client type

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields:()=>({
        id: {type:GraphQLID},
        name : {type:GraphQLString},
        email: {type:GraphQLString},
        phone: {type : GraphQLString}
    })
});

//Project type

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields:()=>({
        id: {type:GraphQLID},
        name : {type:GraphQLString},
        description: {type:GraphQLString},
        status: {type : GraphQLString},
        client:{
            type: ClientType,
            resolve(parent,args){
                return Client.findByID(parent.clientId);
            }
        }
    }),
});



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    //These fields will relate(pretain) to queries
    fields:{
        projects:{
            type: new GraphQLList(ProjectType),
            resolve(parent,args){
                return Project.find();
            }
        },
        //To fetch a client
        project:{
            type : ProjectType,
            //Args to identify a client
            args:{id : {type : GraphQLID}},
            //Returns the client
            resolve(parent,args){
                return Project.findById(args.Id);
            }
        },
        clients:{
            type: new GraphQLList(ClientType),
            resolve(parent,args){
                return cClient.find();
            }
        },
        //To fetch a client
        client:{
            type : ClientType,
            //Args to identify a client
            args:{id : {type : GraphQLID}},
            //Returns the client
            resolve(parent,args){
                return clients.findById(args.Id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
})