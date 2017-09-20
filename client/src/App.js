import React, { Component } from 'react';
import './App.css';


function consLog(input) {
  console.log(JSON.stringify(input));
}


class App extends Component {
  state = {shortcuts: [], keyboardInput: 'cancer', translations: {}, newKey: '', newValue: ''}

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  getShortcuts(word) {
    return fetch('shortcuts/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: word
      })
    }).then(res => res.json()).then(response => {
      return {input: word, suggestions: response};
    });
  }

  setShortcut(key, value) {
    return fetch('shortcuts/new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: key,
        value: value
      })
    });


  }


  componentDidMount() {
    this.updateShortcuts();
  }

  updateShortcuts() {
    var words = [];
    var keyboardInput = this.state.keyboardInput;
    var translations = this.state.translations;

    words = words.concat(keyboardInput.split(' '));

    var promises = [];

    translations = Object.keys(translations).filter(obj => {
      console.log(obj);
      words.includes(obj);
    });

    words.forEach(word => {
      if (!(word in translations )) {
        promises.push(this.getShortcuts(word));
      }
    });

    Promise.all(promises).then(responses => {
      responses.forEach(response => {
        if(response.suggestions.length > 0) {
          translations[response.input] = response.suggestions;

        } else {
          // word isn't in the translations,
          // nor are there shortcuts. delete translation
          delete translations[response.input];
        }
      });

    }).then(() =>{
      this.setState({
        translations: translations
      });
    });
  }

  handleNewShortcuts = () => {
    var key = this.state.newKey;
    var value = this.state.newValue;
    consLog(value);

    var output = this.setShortcut(key, value);
    var updatedTranslations = this.state.translations;
    delete updatedTranslations[key];
    this.setState({key: '', value: '', translations: updatedTranslations}, () => {
      this.updateShortcuts();
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value} , () => {
      this.updateShortcuts();
    });
  }

  render() {
    var rows = [];
    var index = 0;

    Object.keys(this.state.translations).forEach(key => {

      var innerTranslations = [];

      this.state.translations[key].forEach((potential) => {
        index++;
        innerTranslations.push(<td key={index}>{potential.text}</td>);
      });
      index++;

      rows.push(<tr key={index}><td>{key}</td>{innerTranslations}</tr>);
    });

    return (
      <div className="App">
        <h1>Diagnosis</h1>
          <input type="text" name="keyboardInput" value={this.state.keyboardInput} onChange={this.handleChange} />

          <table>
            <tbody>
              <tr>
                <th>Input Text</th>
                <th>Potential Terms</th>
              </tr>

              {rows}
            </tbody>
          </table>
          Add new shortcut:
          <input type="text" name="newKey" value={this.state.newKey}
            onChange={this.handleChange}/>
          <input type="text" name="newValue" value={this.state.newValue}
            onChange={this.handleChange}/>

          <button onClick={this.handleNewShortcuts}>
            Add New Shortcut
          </button>

      </div>
    );
  }
}

export default App;
