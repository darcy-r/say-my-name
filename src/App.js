import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';

const namesData = {
  "d'arcy" : [
    {
      "language" : "English",
      "transcriptions" : [
        {
          "variety" : "Australian English",
          "transcription" : "ˈdɐːsiː",
        },
        {
          "variety" : "General American",
          "transcription" : "ˈdɑːɹsiː",
        },
        {
          "variety" : "Standard Southern British",
          "transcription" : "ˈdɑːsiː",
        },
      ],
    }
  ],
  "šimun" : [
    {
      "language" : "Bosnian, Croatian, Montenegrin, Serbian",
      "transcriptions" : [
        {
          "variety" : "Croatian",
          "transcription" : "ˈʂimun",
        },
      ],
    }
  ],
}

const lookAlikes = {
  "simun" : "Šimun"
}

const segmentDescriptions = {
  "ˈ" : "placed before the syllable with primary stress",
  // vowels
  "ɐː" : "like the 'a' in 'bath' (Australian)",
  "ɑː" : "like the 'a' in 'bath' (General American, Standard Southern British)",
  "i" : "like the 'i' in 'sit'",
  "iː" : "like the 'ee' in 'see'",
  "u" : "like the 'u' in 'pull'",
  // consonants
  "m" : "like the 'm' in 'miss'",
  "n" : "like the 'n' in 'no'",
  "d" : "like the 'd' in 'dog'",
  "ɹ" : "like the 'r' in 'run'",
  "s" : "like the 's' in 'say'",
  "ʂ" : "no exact equivalent in English; sounds like the 'sh' in 'shop', but with the tongue curled up; more info",
}

function SearchInput({ formValue, onFormChange }) {
  return (
    <Form>
      <Form.Group>
        <Form.Control
          id="inputPassword5"
          placeholder="Search for names"
          value={formValue}
          onChange={(e) => {
            onFormChange(e.target.value);
          }}
        />
      </Form.Group>
    </Form>
  );
}

function Spellingsuggestion({ suggestedName, onClickHandler }) {
  return (
    <span onClick={(e) => {
      onClickHandler(suggestedName);
    }} className="spelling-suggestion">
      {suggestedName}
    </span>
  )
}

function segmentise(nameString) {
  let segments = [];
  let holdingCharacters = [];
  for (const character of nameString.split("").reverse().join("")) {
    if (character == "ː") {
      holdingCharacters.push(character);
    }
    else {
      if (holdingCharacters.length > 0) {
        segments.push(character.concat('', holdingCharacters.join()));
        holdingCharacters = [];
      }
      else {
        segments.push(character);
      }
    }
  }
  return segments.toReversed()
}

function VarietySpecificTranscription({ transcriptionInfo }) {
  let segmentDivs = [];
  const segments = segmentise(transcriptionInfo["transcription"]).forEach((s, index) => {
    segmentDivs.push(<tr key={index}><td>{s}</td><td>{segmentDescriptions[s]}</td></tr>)
  });
  return (
    <Card>
      <Card.Body>
        <Card.Title>{transcriptionInfo["variety"]}</Card.Title>
        <Card.Text>
          <span className="transcription">
            [{transcriptionInfo["transcription"]}]
          </span>
        </Card.Text>
        <Table>
          <tbody>
            {segmentDivs}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

function VarietyCard({ varietySpecificNameInfo, index }) {
  console.log(index);
  let transcriptions = [];
  varietySpecificNameInfo["transcriptions"].forEach((transcription, nestedIndex) => {
    transcriptions.push(
      <VarietySpecificTranscription
        transcriptionInfo={transcription}
        key={nestedIndex}
      />
    )
  });
  return (
    <Accordion.Item eventKey={index}>
      <Accordion.Header>{varietySpecificNameInfo["language"]}</Accordion.Header>
      <Accordion.Body>
        <Stack gap={3}>
          {transcriptions}
        </Stack>
      </Accordion.Body>
    </Accordion.Item>
  )
}

// function SearchResult({ nameInfo }) {
//   // let varietiesAccordion = [];
//   // nameInfo.forEach((nameDetail) => {
//   //   varietiesAccordion.push(<VarietyCard varietySpecificNameInfo={nameDetail}/>)
//   // });
//   // return varietiesAccordion
//   console.log(nameInfo);
//   return <div> yes </div>
// }

function SearchResults({ v, suggestedNameOnClickHandler }) {
  if (v == "") {
    return <div/>
  }
  else if (v.toLowerCase() in namesData) {
    let results = [];
    namesData[v.toLowerCase()].forEach((name, index) => {
      results.push(<VarietyCard varietySpecificNameInfo={name} index={index} key={index}/>)
    });
    return (
      <Accordion defaultActiveKey="0" alwaysOpen>
        {results}
      </Accordion>
    )
  }
  else if (v.toLowerCase() in lookAlikes) {
    return (
      <div>
        "{v}" isn't in the database. Did you mean <Spellingsuggestion suggestedName={lookAlikes[v.toLowerCase()]} onClickHandler={suggestedNameOnClickHandler}/>?
      </div>
    )
  }
  return (
    <Alert variant="secondary">
      Unfortunately this name does not exist in the database yet.
    </Alert>
  );
}

function App() {
  const [searchedForName, setSearchedForName] = useState('');
  function handleFormChange(inputString) {
    setSearchedForName(inputString);
  }
  return (
    <div className="App">
      <div className="app-body">
        <Stack gap={3}>
            <div><h3>Learn how to pronounce people's names correctly</h3></div>
            <SearchInput formValue={searchedForName} onFormChange={handleFormChange}/>
            <SearchResults v={searchedForName} suggestedNameOnClickHandler={handleFormChange}/>
        </Stack>
      </div>
    </div>
  );
}

export default App;
