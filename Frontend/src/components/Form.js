const Form = function({handleSubmit, handleUpdateName, handleUpdateNumber, newName, newNumber}) {
  return (
    <form onSubmit={handleSubmit}>
    <div>
      name: <input onChange={handleUpdateName} 
      placeholder='New Contact'
      value={newName}/>
    </div>
    <div>
      number: <input onChange={handleUpdateNumber} 
      placeholder='000000000'
      value={newNumber} required/>
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
    </form>
  )
}

export default Form;