import axios from "axios";
import { useEffect, useState } from "react";
import TodoInput from "./TodoInput";

const getTodos = () => {
  const config = {
    url: "https://json-server-mocker-masai.herokuapp.com/tasks",
    method: "get"
  };
  return axios(config);
};

const createTodo = (title) => {
  const payload = {
    title,
    status: false
  };
  const config = {
    url: "https://json-server-mocker-masai.herokuapp.com/tasks",
    method: "post",
    data: payload
  };
  return axios(config);
};

function Todos() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    handleGetTodos();
  }, []);

  const handleGetTodos = () => {
    return getTodos()
      .then((res) => {
        setTodos(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsError(true);
      });
  };

  const updateTodo = (id, status) => {
    return axios({
      url: `https://json-server-mocker-masai.herokuapp.com/tasks/${id}`,
      method: "patch",
      data: {
        status: status
      }
    });
  };
  const markEverythingAsComplete = async () => {
    try {
      const ids = todos.map((item) => item.id);

      for (let id of ids) {
        console.log(`marking ${id} done.`);
        await updateTodo(id, true);
      }
      await handleGetTodos();
      console.log(`marked all done.`);
    } catch (err) {
      setIsError(true);
    }
  };
  const handleToggle = async (id, status) => {
    try {
      await updateTodo(id, !status);
      await handleGetTodos();
    } catch (err) {
      setIsError(true);
    }
  };

  const onSubmit = async (title) => {
    try {
      setIsLoading(true);
      await createTodo(title);
      await handleGetTodos();
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      console.error();
    }
  };
  if (isLoading) {
    return <div>...loading</div>;
  }
  if (isError) {
    console.error();
    return <div>ERROR!</div>;
  }

  const handleDelete = async (id) => {
    try {
      const config = {
        url: `https://json-server-mocker-masai.herokuapp.com/tasks/${id}`,
        method: "delete"
      };
      await axios(config);
    } catch (err) {
      setIsError(true);
    }
    handleGetTodos();
  };

  return (
    <>
      <TodoInput onSubmit={onSubmit} />
      <ul>
        {todos.map((item) => (
          <li className="pending" key={item.id}>
            <span>{item.title}</span>
            <span>{item.status ? "DONE" : "PENDING"}</span>
            <button
              className="toggleBtn"
              onClick={() => handleToggle(item.id, item.status)}
            ></button>
            <button
              className="deleteBtn"
              onClick={() => handleDelete(item.id, item.status)}
            ></button>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={markEverythingAsComplete}>MARK ALL DONE</button>
      </div>
    </>
  );
}

export default Todos;
