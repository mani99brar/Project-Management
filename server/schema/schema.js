
const Project = require('../models/Project.js');
const Client = require('../models/Client.js');

//Used to create a type for different resources like projects clients etc.
const {GraphQLObjectType,GraphQLID,GraphQLString,GraphQLSchema,GraphQLList,GraphQLNonNull,GraphQLEnumType} = require('graphql');

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
                return Client.findById(parent.clientId);
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
                return Client.find();
            }
        },
        //To fetch a client
        client:{
            type : ClientType,
            //Args to identify a client
            args:{id : {type : GraphQLID}},
            //Returns the client
            resolve(parent,args){
                return Client.findById(args.Id);
            }
        }
    }
});

//Mutations to update db

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addClient:{
            type: ClientType,
            args:{
                name:{type : new GraphQLNonNull(GraphQLString)},
                email:{type : new GraphQLNonNull(GraphQLString)},
                phone:{type : new GraphQLNonNull(GraphQLString)},
            },
            resolve(params,args){
                const client = new Client({
                    name : args.name,
                    email: args.email,
                    phone: args.phone,
                });

                return client.save();
            }
        },
        deleteClient:{
            type: ClientType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                return Client.findByIdAndRemove(args.id);
            }
        },
        addProject:{
            type: ProjectType,
            args:{
                name:{type : new GraphQLNonNull(GraphQLString)},
                description:{type : new GraphQLNonNull(GraphQLString)},
                status:{
                    type : new GraphQLEnumType({
                    name: 'ProjectStatus',
                    values:{
                        'new':{value:'Not Started'},
                        'progress':{value: 'In Progress'},
                        'completed':{value:' Completed'},
                    }
                }),
                defaultValue: 'Not Started',
                },
                clientId:{type : new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                const project = new Project({
                    name:args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                })
                return project.save();
            },
        },
        //Delete a project

        deleteProject:{
            type: ProjectType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                return Project.findByIdAndRemove(args.id);
            },
        },
        updateProject:{
            type: ProjectType,
            args:{
                id:{type : new GraphQLNonNull(GraphQLID)},
                name :{type : GraphQLString},
                description: {type : GraphQLString},
                status:{
                    type : new GraphQLEnumType({
                    name: 'ProjectStatusUpdate',
                    values:{
                        'new':{value:'Not Started'},
                        'progress':{value: 'In Progress'},
                        'completed':{value:' Completed'},
                    }
                }),
                }
            },
            resolve(parent,args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name:args.name,
                            description:args.description,
                            status:args.status,
                        },
                    },
                    //Will create a new project if it is not their
                    {new : true}
                )
            }
        }

    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})