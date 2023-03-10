import { useState, useEffect } from 'react';
import axios from 'axios';

import People from './components/People';
import Filter from './components/Filter';
import Form from './components/Form'
import MessageBox from './components/ErrorMessage';
import services from './services/phonebook';

const App = () => {
  // const [persons, setPersons] = useState([
  //   { name: 'Arto Hellas', number: '040-123456', id: 0 },
  //   { name: 'Ada Lovelace', number: '39-44-5323523', id: 1 },
  //   { name: 'Dan Abramov', number: '12-43-234345', id: 2 },
  //   { name: 'Mary Poppendieck', number: '39-23-6423122', id: 3 }
  // ]);
  const [persons, setPersons] = useState([]);
  const [messageBox, setMessageBox] = useState(null);
  const [messageOperation, setMessageOperation] = useState(null);

  useEffect(() => {
    services.getAll()
    .then(response => {
      console.log(response.data)
      setPersons(response.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  useEffect(() => {
    services.getAll()
    .then(response => {
      console.log(response.data)
      setPersons(response.data);
    }).catch(err => {
      console.error(err);
    });
  }, [messageBox]);




  const [newName, setNewName] = useState('');

  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [filtered, setFiltered] = useState(null);

  const filteredPersons = function(filter) {
    return persons.filter(person => {
      return person.name.toLowerCase().includes(filter.toLowerCase());
    })
  }

  const handleFilterChange = function(eve) {
    setFilter(eve.target.value);
    setFiltered(filteredPersons(eve.target.value));
  }
  const noDuplicates = function() {
    let noDuplicate = true;
    persons.forEach(person => {
      if (person.name === newName) {
        noDuplicate = false;
      }
    });
    return noDuplicate;
  };

  const handleUpdateName = function(eve) {
    setNewName(eve.target.value);
  };

  const handleUpdateNumber = function(eve) {
    setNewNumber(eve.target.value);
  }

  const toggleMessageBox = function (message, operation) {
    setMessageBox(message);
    setMessageOperation(operation);
    setTimeout(() => {
      setMessageBox(null);
    }, 5000);
  }

  const handleNewContact = function(eve) {
    eve.preventDefault();
    if (noDuplicates()) {
      services.create({ 
        name: newName,
        number: newNumber })
        .then(response => {
          console.log('response data :>> ', response.data);
          // setPersons(
          //   persons.concat(
          //     response.data
          //   )
          // )
          toggleMessageBox(`Added ${newName}.`, 'success');
          
        }).catch(err => {
          console.error('There was an error: ' + err)
        })

      setFiltered(null);
      setNewName('');
      setNewNumber('');
    } else {
      if (window.confirm(`${newName} is already added to phonebook, Replace the old number with a new one?`)) {
        let person = persons.find(person => person.name === newName);
        let id = person.id;
        console.log('person, id :>> ', person, id);
        services.update(id, { ...person, number: newNumber })
          .then(response => {
            toggleMessageBox(`Updated ${newName}.`, 'success');
            // setPersons(persons.map(person => {
            //   return person.id === id ? response.data : person;
            // }))
            // setPersons(persons.map(person => {
          })
      }
    }
  };

  const handleDelete = function(id) {
    if (window.confirm('Do you really want to delete the person?')) {
      services.remove(id).then(response => {
        let name;
        setPersons(
          persons.filter(person => {
            if (person.id === id) {
              name = person.name;
            }
            return person.id !== id
          })
        )
        toggleMessageBox(`Deleted ${name}.`, 'deleted');
        setFiltered(null);
        setNewName('');
        setNewNumber('');
        
      }).catch(err => {
        console.error(err);
        toggleMessageBox(`The person has already been removed`, 'error');
      })
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter handler={handleFilterChange}/>
      </div>
      <Form 
        handleSubmit={handleNewContact}
        handleUpdateName={handleUpdateName}
        handleUpdateNumber={handleUpdateNumber} 
        newName={newName}
        newNumber={newNumber}
        />
      <MessageBox message={messageBox} operation={messageOperation}/>
      <h2>Numbers</h2>
      <People 
        contacts={filtered === null ? persons : filtered}
        handleDelete={handleDelete}/>
    </div>
  );
}

export default App;
