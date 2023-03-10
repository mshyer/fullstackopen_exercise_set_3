const MessageBox = ({message, operation}) => {

  const errorStyle = {
    background: '#cecece',
    border: '2px solid red',
    color: 'red',
    fontSize: '16'
  }
  const successStyle = {
    background: '#cecece',
    border: '2px solid green',
    color: 'green',
    fontSize: '16'
  }

  if (message === null) {
    return null;
  }
  return (
    <div 
      className='error' 
      style={operation === "success" ? successStyle : errorStyle}>
      <em>{message}</em>
    </div>
  )
}

export default MessageBox;