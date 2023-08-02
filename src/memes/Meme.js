import React, { useEffect, useState } from 'react'
import styles from './styles.module.css' 
import { useHistory } from 'react-router-dom';


export const Meme = () =>{

    const [memes, setMemes] = useState([])
    const [memeIndex, setMemeIndex] = useState(0)
    const [captions, setCaptions] = useState([])
    const history = useHistory()

    const updateCaption = (e, index) => {
        const text = e.target.value || ''
        setCaptions(
            captions.map((c, i) =>{
                if(index === i){
                    return text
                } else {
                    return c;
                }
            })
        )
    }

    const generateMeme = () => {
        const currentMeme = memes[memeIndex]
        const formData = new FormData()
        
        formData.append('username', process.env.REACT_APP_API_USERNAME)
        formData.append('password', process.env.REACT_APP_API_PASSWORD)
        formData.append('template_id', currentMeme.id)
        captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c))

        fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData
        }).then(res => {
            res.json().then(res => {
                history.push(`/generated?url=${res.data.url}`)
            })
        })
    }
    
    //fisher-yates shuffle algo
    const shuffleMemes = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      };

    //effect for skipping memes
    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes').then(res => res.json().then(res => {
           const localMemes = res.data.memes
           shuffleMemes(localMemes)
           setMemes(localMemes)
        }))
    }, [])

    //effect for captions
    useEffect(() => {
        if(memes.length){
            //box_count represents the number of captions
            setCaptions(Array(memes[memeIndex].box_count).fill(''))
        }
    }, [memeIndex, memes])

    return(
        memes.length ? 
        <div className={styles.container}>
            <button onClick={generateMeme} className={styles.create}>Create</button>
            <button onClick={()=>setMemeIndex(memeIndex + 1)}className={styles.skip}>Skip</button>
            {
                captions.map((c, index) => (
                    <input onChange={(e) => updateCaption(e, index)} key={index}/>
                ))
            }
            <img alt ='meme' src={memes[memeIndex].url}/>
        </div> : <></>
    )
}