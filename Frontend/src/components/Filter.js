const Filter = ({handler}) => {

  return (
    <label>
        filter shown with
      <input type='text' onChange={handler}/>
    </label>
  );
}
export default Filter;