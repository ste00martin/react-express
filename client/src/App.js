import React, { Component } from 'react';
import './App.css';


function consLog(input) {
  console.log(JSON.stringify(input));
}


class App extends Component {
  state = {shortcuts: [], keyboardInput: 'cancer', translations: {}}

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

    // TODO: make async
    words.forEach(word => {
      if (!(word in translations )) {

        this.getShortcuts(word)
        .then(res => res.json())
        .then(response => {

          if(response.length > 0) {
            translations[word] = response;

            this.setState({
              shortcuts: response,
              translations: translations
            });
          }
        })
        .catch(error => {
          // console.log(error);
        });
      }
    });

  }

  handleChange(event) {
    this.setState({keyboardInput: event.target.value} , () => {
      this.updateShortcuts();
    });
  }

  render() {
    var rows = [];
    var lastCategory = null;
    // consLog(this.state.translations);
    var index = 0;

    Object.keys(this.state.translations).map((key) => {
      consLog(this.state.translations[key]);

      var innerTranslations = [];

      this.state.translations[key].forEach((potential) => {
        index++;
        innerTranslations.push(<th key={index}>{potential.text}</th>);
      })
      rows.push(<tr><th>{key}</th>{innerTranslations}</tr>);

    });

    return (
      <div className="App">
        <h1>Diagnosis</h1>
        <form>
          <label>
            <textarea value={this.state.keyboardInput} onChange={this.handleChange} />
          </label>
        </form>
        <table>
          <tbody>
              {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
