import { useState, useEffect } from "react"
const App = () => {

  const [ value, setValue] = useState(null);
  const [ message , setMessage ] = useState(null);
  const [ previousChats, setPreviousChats] = useState([])
  const [ currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      },
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json(); // Added await to properly resolve the promise
      
      // Ensure data.choices exists and has at least one entry before accessing
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        
        setMessage(data.choices[0].message);
      } else {
        console.log('Aucun choix disponible ou data.choices est undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title:currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() =>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Jules Sore</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>AIDGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>|   {chatMessage.content}</p>
            
          </li>)}

        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">

          </p>
        </div>
      </section>
    </div>
  )
}

export default App