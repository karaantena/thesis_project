const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { pool, testConnection } = require('./database');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
function insertData(patientID, diagnosisID, note, date, image) {


    const insertQuery = `INSERT INTO main (patient_ID, diagnosis_ID, date, data_type_ID, image, note) VALUES (?, ?, ?, ?, ?, ?)`;
    console.log('insertQuery ', insertQuery)
    pool.query(insertQuery, [patientID, diagnosisID, new Date(date), 1, image , note], (error, results, fields) => {
        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully:', results);
        }
    });
}

app.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
  
    pool.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error('Error querying the database:', error);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
      }
  
      if (results.length > 0) {
        res.status(400).json({ success: false, message: 'Email already registered' });
        return;
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('Hashed password to store:', hashedPassword);
  
      pool.query(
        'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword],
        (error, results) => {
          if (error) {
            console.error('Error inserting user into the database:', error);
            res.status(500).json({ success: false, message: 'Server error' });
          } else {
            res.json({ success: true, message: 'Registration successful!' });
          }
        }
      );
    });
  });
  
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    
    pool.query(query, [email], async (error, results) => {
      if (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }
  
      res.json({ success: true, userId: user.id });
    });
  });
  

app.get('/api/users', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  
  app.get('/api/rights', (req, res) => {
    pool.query('SELECT * FROM rights', (error, results) => {
      if (error) {
        console.error('Error fetching rights:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  

  app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
    pool.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.status(204).send(); 
            }
        }
    });
});

app.delete('/api/users_rights/:id_user', (req, res) => {
  const userId = req.params.id_user;
  const query = 'DELETE FROM user_rights WHERE id_user = ?';
  pool.query(query, [userId], (error, results) => {
      if (error) {
          console.error('Error deleting user rights:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
              res.status(204).send();           
      }
  });
});

app.post('/api/rights', (req, res) => {
  const { description, is_department } = req.body;

  const sql = 'INSERT INTO rights (description, is_department) VALUES (?, ?)';
  const values = [description, is_department ? 1 : 0];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting new right:', err);
      res.status(500).json({ error: 'Error inserting new right' });
      return;
    }

    const newRight = {
      id: result.insertId,
      description,
      is_department: is_department ? 1 : 0,
    };

    res.status(201).json(newRight);
  });
});
  app.post('/api/user_rights', (req, res) => {
    const { id_user, id_right, checked } = req.body;
    if (checked) {
      pool.query('INSERT INTO user_rights (id_user, id_right) VALUES (?, ?)', [id_user, id_right], (error, results) => {
        if (error) {
          console.error('Error adding user right:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json({ success: true });
        }
      });
    } else {
      pool.query('DELETE FROM user_rights WHERE id_user = ? AND id_right = ?', [id_user, id_right], (error, results) => {
        if (error) {
          console.error('Error deleting user right:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
  
app.post('/api/user_rights', (req, res) => {
    const { id_user, id_right, checked } = req.body;
    console.log('Request to update user rights:', req.body);
    
    if (checked) {
      pool.query('INSERT INTO user_rights (id_user, id_right) VALUES (?, ?) ON DUPLICATE KEY UPDATE id_user = VALUES(id_user), id_right = VALUES(id_right)', [id_user, id_right], (error, results) => {
        if (error) {
          console.error('Error adding user right:', error);
          res.status(500).json({ error: 'Internal server error: ' + error.message });
        } else {
          res.json({ success: true });
        }
      });
    } else {
      pool.query('DELETE FROM user_rights WHERE id_user = ? AND id_right = ?', [id_user, id_right], (error, results) => {
        if (error) {
          console.error('Error deleting user right:', error);
          res.status(500).json({ error: 'Internal server error: ' + error.message });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
  
app.get('/api/user/:id', async (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT id, first_name, last_name, email FROM users WHERE id = ?';
    
    pool.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
  
      res.json({ success: true, user: results[0] });
    });
});
  

app.post('/api/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const query = 'SELECT password FROM users WHERE id = ?';
  
  pool.query(query, [userId], async (error, results) => {
    if (error) {
      console.error('Error fetching user password:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Old password is incorrect' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';

    pool.query(updateQuery, [hashedNewPassword, userId], (updateError) => {
      if (updateError) {
        console.error('Error updating password:', updateError);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      res.json({ success: true, message: 'Password changed successfully' });
    });
  });
});

app.post('/chestXray-analyze', upload.single('image'), async (req, res) => {

    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }


    const preprocessedImage = await preprocessImage(req.file);
    const predictions = model.predict(preprocessedImage);
    const predictionsArray = predictions.arraySync()[0];
    const maxProbability = Math.max(...predictionsArray)
    const maxProbabilityIndex = predictionsArray.indexOf(maxProbability);
    predictionsArray[maxProbabilityIndex] = -Infinity;

    const secondMaxProbabilityIndex = predictionsArray.indexOf(Math.max(...predictionsArray));

    const classLabels = [1, 2, 3, 4];

    const maxClassLabel = classLabels[maxProbabilityIndex];
    const secondMaxClassLabel = classLabels[secondMaxProbabilityIndex];

    console.log('First guess:', maxClassLabel, 'with probability:', maxProbabilityIndex);
    console.log('Second guess:', secondMaxClassLabel, 'with probability:', predictionsArray[secondMaxProbabilityIndex]);

    const response = [
        {
            id: maxClassLabel,
            probability: maxProbability
        },
        {
            id: secondMaxClassLabel,
            probability: predictionsArray[secondMaxProbabilityIndex]
        }
    ];
    res.json(response);
});


app.post('/save-record', upload.single('image'), (req, res) => {
    const { patientId, diagnosisId, note, date } = req.body;
    const image = req.file.filename;
    insertData(patientId, diagnosisId, note, date, image);
    res.send('Data saved successfully.');
});

app.post('/update-record', (req, res) => {
  const { id_record, note, id_diagnosis } = req.body;
  const sql = 'UPDATE main SET note = ?, diagnosis_ID = ? WHERE ID = ?';
  const values = [note, id_diagnosis, id_record];

  pool.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error updating record:', err);
          res.status(500).json({ error: 'Failed to update record' });
      } else {
          console.log('Record updated successfully');
          res.status(200).json({ message: 'Record updated successfully' });
      }
  });
});

testConnection();

app.listen(3001, () => {
    console.log(`Server running at http://localhost:${3001}`);
});


app.get('/diagnosis', (req, res) => {
    const query = 'SELECT id, diagnosis FROM diagnosis'; 
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching diagnosis:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

app.get('/datatypes', (req, res) => {
    const query = 'SELECT id, data_type FROM data_types'; 
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data type:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

app.get('/diagnosis/:id', (req, res) => {
    console.log("req", req.body)
    const diagnosisId = req.body.id;
    const sql = 'SELECT diagnosis FROM diagnosis WHERE id = ?';
    pool.query(sql, [diagnosisId], (err, result) => {
        if (err) {
            console.error('Error fetching diagnosis from MySQL:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Diagnosis not found' });
            return;
        }
        const diagnosis = result[0].diagnosis;
        res.json({ id: diagnosisId, diagnosis: diagnosis });
    });
});

app.get('/rights/:id', (req, res) => {
  console.log("req", req.body)
  const rightId = req.params.id;
  const sql = 'SELECT description FROM rights WHERE id = ?';
  pool.query(sql, [rightId], (err, result) => {
      if (err) {
          console.error('Error fetching rightd from MySQL:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (result.length === 0) {
          res.status(404).json({ error: 'Right not found' });
          return;
      }
      const description = result[0].description;
      res.json({ id: rightId, description: description });
  });
});

app.get('/patients', (req, res) => {
  const userId = req.query.userId;

  const query1 = `
      SELECT id_user 
      FROM user_rights 
      WHERE id_user = ? AND id_right IN (1, 2)
  `;

  pool.query(query1, [userId], (error, results) => {
      if (error) {
          console.error('Error checking user rights:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      console.log("result", results)
      if (results.length > 0) {
          const query = `
              SELECT p.id, p.first_name, p.last_name, p.dob, p.gender, p.id_right 
              FROM patients p
          `;
          
          pool.query(query, (error, results) => {
              if (error) {
                  console.error('Error fetching patients:', error);
                  res.status(500).json({ error: 'Internal Server Error' });
              } else {
                  res.json(results);
              }
          });
      } else {

          const query = `
              SELECT p.id, p.first_name, p.last_name, p.dob, p.gender, p.id_right 
              FROM patients p
              JOIN user_rights ur ON p.id_right = ur.id_right
              WHERE ur.id_user = ?
              OR ur.id_right IS NULL
          `;

          pool.query(query, [userId], (error, results) => {
              if (error) {
                  console.error('Error fetching patients:', error);
                  res.status(500).json({ error: 'Internal Server Error' });
              } else {
                  res.json(results);
              }
          });
      }
  });
});

app.post('/patients', (req, res) => {
  const { first_name, last_name, dob, gender, department } = req.body;

  const query = `
      INSERT INTO patients (first_name, last_name, dob, gender, id_right)
      VALUES (?, ?, ?, ?, ?)
  `;
  const values = [first_name, last_name, dob, gender, department];

  pool.query(query, values, (error, results) => {
      if (error) {
          console.error('Error adding patient:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(201).json({ message: 'Patient added successfully' });
      }
  });
});

app.put('/patients/:id', (req, res) => {
  const { id } = req.params;
  const { id_right } = req.body; 

  const sql = 'UPDATE patients SET id_right = ? WHERE id = ?';
  pool.query(sql, [id_right, id], (err, result) => {
      if (err) {
          console.error('Error updating patient:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json({ message: 'Patient updated successfully' });
  });
});

app.delete('/patients/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM patients WHERE id = ?'; 
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting patient:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ error: 'Patient not found' });
            } else {
                res.status(204).send(); 
            }
        }
    });
});

app.delete('/main/:id', (req, res) => {

    const id  = req.params.id;
    console.log("id", id)

    const query = 'DELETE FROM main WHERE ID = ?'; 
    console.log('query', query)
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting records:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log("results", results)
            if (results.affectedRows === 0) {
                res.status(404).json({ error: 'Record not found' });
            } else {
                res.status(204).send(); 
            }
        }
    });
});

app.get('/patients/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT id, first_name, last_name, dob, gender, id_right FROM patients WHERE id = ?`;
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error fetching patient:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: 'Patient not found' });
            } else {
                res.json(results[0]);
            }
        }
    });
});

app.get('/records/:id', (req,res) =>{
    const { id } = req.params;
    console.log("id", id)
    const query = `SELECT main.*, diagnosis.diagnosis  FROM main JOIN diagnosis ON main.diagnosis_ID = diagnosis.id
    WHERE patient_id = ? ORDER BY date, data_type_ID `;
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error fetching patient:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: 'Patient not found' });
            } else {
                console.log("query records results", results)

                res.json(results);
            }
        }
    });
});


let model;

(async () => {
    try {
        model = await tf.loadLayersModel('file://./model/model_chestXray.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
})();

async function preprocessImage(imageBuffer) {
    try {
        console.log("imageBuffer", imageBuffer)
        const dataObj = imageBuffer
        const img_buffer = fs.readFileSync(dataObj.path)
    
        const resizedBuffer = await sharp(img_buffer)
            .resize(224, 224)
            .toFormat('jpeg')
            .toBuffer();

        const tensor = tf.node.decodeJpeg(resizedBuffer);

        const normalizedTensor = tensor.toFloat().div(255.0);

        const expandedTensor = normalizedTensor.expandDims(0);

        return expandedTensor;
        
    } catch (error) {
        console.error('Error preprocessing image:', error);
        throw error;
    }
}



