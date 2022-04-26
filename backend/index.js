//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const express = require('express');
const cors = require('cors');

//////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 3000;

const pool = require('./db'); //Import from db.js

//////////////////////////////////////////////////////
// SETUP APP
//////////////////////////////////////////////////////
app.use(cors());

// REQUIRED TO READ POST>BODY if using "raw" > "JSON"
app.use(express.json());

// REQUIRED TO READ POST>BODY if using "x-www-form-urlencoded"
// If not req.body is empty
app.use(express.urlencoded({ extended: false }));

//////////////////////////////////////////////////////
// POST GET METHODS
// http://localhost:3000/api/
// Use Postman to test
//////////////////////////////////////////////////////
app.get('/api', async (req, res, next) => {
    console.log(req.query);

    res.json(req.query);
});

app.post('/api', async (req, res, next) => {
    console.log(req.body);

    res.json(req.body);
});

//////////////////////////////////////////////////////
// SETUP DB
//////////////////////////////////////////////////////
const CREATE_TABLE_SQL = `
    CREATE TABLE quotes (
        id SERIAL primary key,
        quote TEXT not null,
        author TEXT not null
    );
`;

app.post('/api/table/quotes', async (req, res, next) => {
    
    pool.query(CREATE_TABLE_SQL)
    .then(() => {
         res.send(`Table <quotes> created`);
    })
    .catch((error) => {
        res.json(error.message);
    });
});

//////////////////////////////////////////////////////
// CLEAR DB
//////////////////////////////////////////////////////
const DROP_TABLE_SQL = `
    DROP TABLE IF EXISTS quotes;
`;

app.delete('/api/table/quotes', async (req, res, next) => {
    
    pool.query(DROP_TABLE_SQL)
    .then(() => {
        res.send(`Table <quotes> dropped`);
    })
    .catch((error) => {
        res.json(error.message);
    });
});

app.get('/api/quotes', async (req, res, next) => {
    
    try
    {
        console.log(req.query);

        let sQueryStatement= {
            text: 'SELECT * FROM quotes'
        }
        
        const allMessage = await pool.query(sQueryStatement);

        res.json(allMessage.rows);
    }
    catch(error)
    {
        res.json(error.message);
    }
});

app.get('/api/quote', async (req, res, next) => {
    
    try
    {
        console.log(req.query);

        let sQueryStatement= {
            text: 'SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1'
        }

        if(req.query.id != null)
        {
            sQueryStatement= {
                text: 'SELECT * FROM quotes WHERE id = $1',
                values: [req.query.id]
            }
        }

        const allMessage = await pool.query(sQueryStatement);

        res.json(allMessage.rows);
    }
    catch(error)
    {
        res.json(error.message);
    }
});

app.post('/api/quote', async (req, res, next) => {
    try
    {
        console.log(req.body);
        let quote = req.body.quote;
        let author = req.body.author;

        const newInsert = await pool.query("INSERT INTO quotes (quote, author) VALUES ($1, $2) RETURNING *", [quote, author]);

        res.json(newInsert);
    }
    catch(error)
    {
        res.json(error.message);
    }
});

app.delete('/api/quote', async (req, res, next) => {
    try
    {
        console.log(req.body);

        sQueryStatement= {
            text: 'DELETE FROM quotes WHERE id = $1',
            values: [req.body.id]
        }

        const queryReturn = await pool.query(sQueryStatement);

        res.json(queryReturn);
    }
    catch(error)
    {
        res.json(error.message);
    }
});


//////////////////////////////////////////////////////
// DISPLAY SERVER RUNNING
//////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send(`Server running on port ${PORT}`)
});

app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
});