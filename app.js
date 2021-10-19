const express = require('express');
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql');
const mongoose = require('mongoose')
const app = express()
const Event = require('./models/event')
const PORT = process.env.PORT || 8888
app.use(express.json());

app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: buildSchema(`

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: String!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: String!
        date: String!
    }

    type RootQuery{
        events: [Event!]!
    }

    type RootMutation{
        createEvent(eventInput: EventInput): Event
    }

        schema{
            query: RootQuery
            mutation: RootMutation
        }`
    ),
    rootValue: {
        events: () => {
            return Event.find().then(evey=>{
                return evey.map(even=>{
                    return {...even._doc};
                })
            }).catch(err=>{
                throw err;
            })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event.save().then(res => {
                console.log(res)
                return {...res._doc}
            }).catch(err=>{
                console.log(err);
                throw err
            });
        }
    },
    graphiql: true
})
);


app.get('/', (req, res, next) => {
    res.send('benix')
})
mongoose


  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zqw64.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority
    `
  )
  .then(() => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
