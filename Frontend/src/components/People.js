const People = ({contacts, handleDelete }) => {
  return (
    <>
      {contacts.map(contact => {
        console.log(contact)
        return (
        <div key={contact.id}>
          <p>{contact.name}: {contact.number}</p>
          <button type='button' onClick={handleDelete.bind(this, contact.id)}>delete</button>
        </div>
        )
      })}
    </>
  );
};

export default People;