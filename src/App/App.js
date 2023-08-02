import { Meme } from '../memes/Meme.js';
import { MemeGenerated } from '../GeneratedMeme/MemeGenerated.js'
import { Switch, Route } from 'react-router-dom'
// import styles from './styles.module.css'

export const App = () => {
  return (
    <div>
      <h1>Meme Generator</h1>
      <Switch>
      <Route exact path ='/'> 
        <Meme />
      </Route>
      <Route path='/generated'>
        <MemeGenerated />
      </Route>
      </Switch>
    </div>
  );
}
