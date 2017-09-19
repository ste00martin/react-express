import React, { Component } from 'react';
import './App.css';


function consLog(input) {
  console.log(JSON.stringify(input));
}

//
// class DiagnosisShortcuts extends Component {
//   render() {
//     var inputText = this.props.inputText;
//     var rows = [];
//     var lastCategory = null;
//     this.props.shortcuts.forEach(function(shortcut) {
//       rows.push(<td>{shortcut.name}</td>);
//     });
//
//     return (
//       <tr>
//         <td>{inputText}</td>
//         {rows}
//       </tr>
//     );
//   }
// }


class App extends Component {
  state = {shortcuts: [], keyboardInput: 'yaya man', translations: {}}

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
          translations[word] = response;

          this.setState({
            shortcuts: response,
            translations: translations
          });
        })
        .catch(error => {
          console.log(error);
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
    consLog(this.state.translations);

    this.state.shortcuts.forEach(function(shortcut) {
      rows.push(<tr><th>{shortcut.text}</th></tr>);
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
