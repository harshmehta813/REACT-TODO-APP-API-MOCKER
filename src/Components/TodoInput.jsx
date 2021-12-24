import { useState } from "react";

function TodoInput({ onSubmit }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit && onSubmit(text);
    setText("");
  };
  return (
    <div>
      <form>
        <input placeholder="add something" onChange={handleChange} />
        <button onClick={handleSubmit}>+</button>
      </form>
    </div>
  );
}

export default TodoInput;
