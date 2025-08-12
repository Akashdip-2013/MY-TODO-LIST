import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState("")

  const [dates, setDates] = useState([])
  const [date, setDate] = useState("")

  const [checked, setChecked] = useState([]);

  const [moved, setMoved] = useState(false)
  const [moves, setMoves] = useState([])


  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedDates = JSON.parse(localStorage.getItem("dates")) || [];
    const savedChecked = JSON.parse(localStorage.getItem("checked")) || [];
    const savedmoves = JSON.parse(localStorage.getItem("moves")) || [];

    setTodos(savedTodos);
    setDates(savedDates);
    setChecked(savedChecked);
    setMoves(savedmoves);

  }, []);

  const handleADD = (e) => {
    e.preventDefault();
    if (todo.trim() === "") return;

    if (new Date(date) < new Date()) {
      alert("Please select a future date and time.");
      return;
    }

    playClickSound();

    const newTodos = [...todos, todo];
    const newDates = [...dates, date];
    const newChecked = [...checked, false];
    const newmoves = [...moves, false];

    setTodos(newTodos);
    setDates(newDates);
    setChecked(newChecked);
    setMoves(newmoves);
    setTodo("");
    setDate("");

    localStorage.setItem("todos", JSON.stringify(newTodos));
    localStorage.setItem("dates", JSON.stringify(newDates)); // ✅ FIXED LINE
    localStorage.setItem("checked", JSON.stringify(newChecked));
    localStorage.setItem("moves", JSON.stringify(newmoves));

    document.getElementById("date").value = "";
    // console.log(dates)
  }

  const toggleCheck = (index) => {
    const updatedChecked = [...checked];
    updatedChecked[index] = !updatedChecked[index];
    setChecked(updatedChecked);
    localStorage.setItem("checked", JSON.stringify(updatedChecked));
  };

  const handleDELETE = async (index) => {

    const dltsound = new Audio('woosh-delete.mp3')
    dltsound.play();


    const updatedMoves = [...moves];
    updatedMoves[index] = true;
    setMoves(updatedMoves);


    setTimeout(() => {

      const newTodos = todos.filter((_, i) => i !== index);
      const newDates = dates.filter((_, i) => i !== index);
      const newChecked = checked.filter((_, i) => i !== index);
      const newmoves = moves.filter((_, i) => i !== index);

      setTodos(newTodos);
      setDates(newDates);
      setChecked(newChecked);
      setMoves(newmoves);

      localStorage.removeItem("todos")
      localStorage.removeItem("dates")
      localStorage.removeItem("checked")
      localStorage.removeItem("moves");

      localStorage.setItem("todos", JSON.stringify(newTodos));
      localStorage.setItem("dates", JSON.stringify(newDates));
      localStorage.setItem("checked", JSON.stringify(newChecked));
      localStorage.setItem("moves", JSON.stringify(newmoves));

    }, 500);


  }

  function formatDateTimeLocal(datetimeStr) {
    if (!datetimeStr || !datetimeStr.includes('T')) return datetimeStr;

    const [datePart, timePart] = datetimeStr.split('T'); // "2025-07-23", "12:30"
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndex = parseInt(month, 10) - 1;
    const monthName = monthNames[monthIndex];

    let hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;

    const formattedDate = `${day} ${monthName} ${year}`;
    const formattedTime = `${hourNum}:${minute} ${ampm}`;

    return `${formattedDate} — ${formattedTime}`;
  }

  function complete() {

    const completedCount = checked.filter((val) => val).length;
    return completedCount;

  }

  function playClickSound() {
    const audio = new Audio("/click.mp3");
    audio.play();
  }

  function getCurrentDateTimeLocal() {
    const now = new Date();
    now.setSeconds(0);
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset);
    return now.toISOString().slice(0, 16);
  }

  return (
    <div className=' bg-[#1c1c1e] h-[100vh] min-h-[550px] px-[0.1rem] py-[4%] flex justify-center items-center '>

      <div className=' flex flex-col justify-center items-center [background:#2c2c2e] w-[95%] max-w-[400px]  rounded-[10px_10px_10px_10px]  p-[1.5rem] px-[0.1rem] m-auto h-[90%] [box-shadow:0px_0px_20px_#FFFFFF0D] '>

        <h1 className=' text-[1.6rem] text-center font-extrabold text-white mb-[0.1rem] '>📝 MY TODO-LIST</h1>

        <form className="inputText flex flex-col  items-center gap-y-3 justify-between w-[100%]  py-[0.2rem] my-[2%] ">

          <input id='date' required type='datetime-local' min={getCurrentDateTimeLocal()} onChange={(e) => setDate(e.target.value)} className='  p-[0.4rem] px-[0.5rem] rounded-[8px] w-[95%] min-w-fit text-[0.85rem] bg-[#e3e3e3] [box-shadow:0px_1px_2px_#aaa] filter invert ' />

          <input id='task' required type="text" placeholder='Enter task...' value={todo} onChange={(e) => setTodo(e.target.value)} className=' [box-shadow:0px_1px_2px_#aaa]  placeholder-black filter invert p-[0.4rem] px-[0.5rem] rounded-[8px]  w-[95%] flex flex-wrap overflow-x-hidden bg-[#e3e3e3] ' />

          <button onClick={handleADD} className='bg-[#00f2fe] font-bold px-[0.8rem] py-[0.2rem] rounded-[0.4rem] hover:scale-115 cursor-pointer text-white transition-all duration-[300ms] text-shadow-2xs text-shadow-black [box-shadow:0px_2px_2px_black]  '>ADD</button>

        </form>
        {todos.length === 0 && <div className=' mb-2 text-center text-gray-400 text-[1rem] flex flex-col justify-between  '>
          No Todos to display 😴
          <img src="/todo_icon.png" alt="" className=' h-55 w-50 p-[20px_0px_0px_0px] ' />
        </div>}

        {todos.length !== 0 && <div className=' mb-2 text-center text-gray-400 text-[1rem] '> Tasks: {todos.length} | Left: {todos.length - complete()} </div>}
        <div className="allTasks w-[95%] h-[100%] overflow-auto no-scrollbar  ">
          {
            todos.map((item, index) => (
              <div id={index} key={index} className={"tasks w-[100%] flex flex-col py-[0.1rem] "}>

                <div className={`todos text-white flex items-start justify-between bg-[#1c1c1e] p-[0.5rem] overflow-x-auto scrollbar-hide rounded-[0.5rem] my-[0.2rem] gap-x-[5%]  [box-shadow:0px_2px_2px_#444] transition-transform  [animation-fill-mode:backwards] ${moves[index] ? 'translate-x-[-100%] opacity-50 duration-500 ' : 'translate-x-[0%] duration-0 '}`}>
                  <span className='flex flex-wrap gap-2 items-baseline w-[70%]  no-scrollbar '>

                    <input type="checkbox" className=' mr-[0.4rem] cursor-pointer ' checked={checked[index] || false} onChange={() => toggleCheck(index)} />

                    <div className='  no-scrollbar whitespace-pre-wrap break-words min-w-0 '>
                      <h1 className={`text-[90%] flex flex-wrap ${checked[index] ? 'line-through text-gray-500' : ''}`}>{item}</h1>

                    </div>
                    {dates[index].length != 0 && <p className=' [text-decoration:underline] text-[#B0BEC5] text-[68%] '>
                      Due: {formatDateTimeLocal(dates[index])}
                    </p>}

                  </span>
                  <button onClick={() => { handleDELETE(index) }} className=' [background:crimson] text-white px-[0.6rem] rounded-[0.3rem] font-bold h-[1.5rem] hover:scale-110 cursor-pointer transition-all duration-[200ms] text-[100%] w-30% [box-shadow:0px_1px_2px_#aaa] '>Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App