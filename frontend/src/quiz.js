import React, { useState } from 'react';
import { Select, Button, Box, Text } from '@chakra-ui/react';
import { db } from './config';
import { collection, doc, setDoc, updateDoc, arrayUnion, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function QuizComponent() {

  const quizBank = [
  {
    issue: "Bipolar Disorder",
    questions: [
      {
        id: 1,
        text: 'How often have you experienced periods of elevated mood or euphoria?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 2,
        text: 'How often have you experienced periods of intense irritability?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 3,
        text: 'How often have you had increased energy or activity levels?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 4,
        text: 'How often have you had racing thoughts or felt your mind was going too fast?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 5,
        text: 'How often have you engaged in risky behaviors or impulsive decisions?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 6,
        text: 'How often have you had difficulty sleeping or felt you needed less sleep than usual?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 7,
        text: 'How often have you experienced periods of intense sadness or depression?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 8,
        text: 'How often have you had difficulty concentrating or making decisions?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 9,
        text: 'How often have you had mood swings that disrupted your life?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 10,
        text: 'How often have you had difficulty maintaining relationships due to mood swings?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
    ],
  },
  {
    issue: "Eating Disorders",
    questions: [
      {
        "id": 1,
        "text": "How often do you worry about your weight, body shape, or appearance?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 2,
        "text": "How often do you engage in restrictive eating or dieting to control your weight?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 3,
        "text": "How often do you feel that your self-worth is tied to your weight or body image?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 4,
        "text": "How often do you binge eat large amounts of food in a short period of time, even if you are not hungry?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 5,
        "text": "How often do you use compensatory behaviors (e.g., vomiting, laxatives, excessive exercise) to control your weight?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 6,
        "text": "How often do you feel out of control during episodes of binge eating?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 7,
        "text": "How often do you experience significant distress about your eating habits?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 8,
        "text": "How often do you hide your eating habits from others?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 9,
        "text": "How often do you skip meals intentionally to control your weight?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 10,
        "text": "How often do you feel dissatisfied with your body or weight?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      }
    ]
  },
  {
    issue: "PTSD",
    questions: [
      {
        "id": 1,
        "text": "How often do you have intrusive memories or flashbacks of a traumatic event?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 2,
        "text": "How often do you have distressing dreams or nightmares about a traumatic event?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 3,
        "text": "How often do you experience intense emotional or physical reactions when reminded of a traumatic event?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 4,
        "text": "How often do you avoid people, places, or situations that remind you of a traumatic event?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 5,
        "text": "How often do you feel emotionally numb or detached from others?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 6,
        "text": "How often do you experience hypervigilance or an exaggerated startle response?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 7,
        "text": "How often do you have difficulty concentrating due to distressing thoughts?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 8,
        "text": "How often do you feel irritable or have outbursts of anger?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 9,
        "text": "How often do you experience sleep disturbances such as insomnia or nightmares?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 10,
        "text": "How often do you experience guilt or blame related to a traumatic event?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      }
    ]
  },
  {
    issue: "OCD",
    questions: [
      {
        "id": 1,
        "text": "How often do you have repetitive and unwanted thoughts, urges, or images that cause distress?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 2,
        "text": "How often do you feel compelled to perform repetitive behaviors (e.g., washing hands, checking doors) to relieve anxiety or prevent a feared event?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 3,
        "text": "How often do these obsessive thoughts or compulsive behaviors take up more than an hour of your day?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 4,
        "text": "How often do your obsessive thoughts or compulsive behaviors interfere with your daily functioning?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 5,
        "text": "How often do you feel distressed when you cannot perform your rituals or compulsions?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 6,
        "text": "How often do you repeat activities such as counting or checking to control obsessive thoughts?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 7,
        "text": "How often do you experience intrusive thoughts about harm, contamination, or symmetry?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 8,
        "text": "How often do you experience an urgent need to keep things in a specific order?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 9,
        "text": "How often do you wash your hands or clean excessively to prevent germs or contamination?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 10,
        "text": "How often do you feel a strong urge to keep items, even if you don't need them?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      }
    ]
  },
  {
    issue: "Schizophrenia",
    questions: [
      {
        "id": 1,
        "text": "How often do you hear voices or sounds that others do not hear?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 2,
        "text": "How often do you experience paranoia or delusional thoughts?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 3,
        "text": "How often do you find it difficult to organize your thoughts or speech?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 4,
        "text": "How often do you feel disconnected from reality?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 5,
        "text": "How often do you experience disorganized behavior, such as odd movements or unusual mannerisms?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 6,
        "text": "How often do you have trouble with self-care or taking care of personal hygiene?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 7,
        "text": "How often do you experience social withdrawal or isolation?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 8,
        "text": "How often do you have difficulty maintaining relationships with others?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 9,
        "text": "How often do you experience unusual perceptions, such as seeing things that others don't see?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 10,
        "text": "How often do you feel apathetic or lack motivation to engage in activities?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      }
    ]
  },
  {
    issue: "Substance Use Disorders",
    questions: [
      {
        "id": 1,
        "text": "How often do you use substances (e.g., alcohol, drugs) more than you intended?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 2,
        "text": "How often do you try to cut down on your substance use but are unsuccessful?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 3,
        "text": "How often do you spend a lot of time obtaining, using, or recovering from the effects of substances?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 4,
        "text": "How often do you experience cravings or a strong desire to use substances?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 5,
        "text": "How often does your substance use interfere with your responsibilities at work, school, or home?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 6,
        "text": "How often do you continue to use substances despite negative consequences (e.g., health, relationships)?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 7,
        "text": "How often do you give up or reduce important social, occupational, or recreational activities due to substance use?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 8,
        "text": "How often do you use substances in situations where it is physically dangerous (e.g., driving under the influence)?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 9,
        "text": "How often do you experience tolerance, needing more of a substance to achieve the same effect?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 10,
        "text": "How often do you experience withdrawal symptoms when you stop using substances?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      }
    ]
  },
  {
    issue: "Anxiety",
    questions: [
      {
        id: 1,
        text: 'How often do you feel excessively worried about everyday situations?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 2,
        text: 'How often do you experience restlessness or a feeling of being on edge?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 3,
        text: 'How often do you find it difficult to control worrying?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 4,
        text: 'How often do you experience physical symptoms such as sweating or trembling when anxious?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 5,
        text: 'How often do you avoid situations or activities because of anxiety?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 6,
        text: 'How often do you experience difficulty concentrating or your mind going blank?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 7,
        text: 'How often do you feel tense or have muscle tension?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 8,
        text: 'How often do you have trouble falling asleep or staying asleep due to anxiety?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 9,
        text: 'How often do you experience a sudden feeling of panic or fear?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 10,
        text: 'How often do you feel afraid in situations where there seems to be no reason for fear?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
    ],
  },
  {
    issue: "Depression",
    questions: [
      {
        id: 1,
        text: 'How often have you experienced feelings of sadness or hopelessness?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 2,
        text: 'How often have you lost interest in activities you once enjoyed?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 3,
        text: 'How often have you had trouble sleeping or sleeping too much?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 4,
        text: 'How often have you experienced changes in appetite or weight?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 5,
        text: 'How often have you had difficulty concentrating or making decisions?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 6,
        text: 'How often have you felt worthless or guilty?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 7,
        text: 'How often have you experienced a lack of energy or fatigue?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 8,
        text: 'How often have you had thoughts of death or suicide?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 9,
        text: 'How often have you felt agitated or restless?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
      {
        id: 10,
        text: 'How often have you withdrawn from others or isolated yourself?',
        options: ['Never or rarely', 'Occasionally', 'Often', 'Very often'],
      },
    ],
  },
  {
    issue: "ADHD",
    questions: [
      {
        "id": 1,
        "text": "How often do you have difficulty sustaining attention in tasks or play activities?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 2,
        "text": "How often do you have difficulty organizing tasks and activities?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 3,
        "text": "How often do you fail to give close attention to details or make careless mistakes in your work?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 4,
        "text": "When you have to sit down for long periods, how often do you feel restless?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 5,
        "text": "How often do you interrupt others during conversations or activities?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 6,
        "text": "How often do you fidget with your hands or feet, or squirm in your seat?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 7,
        "text": "How often do you leave your seat in situations when remaining seated is expected?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 8,
        "text": "How often do you lose things necessary for tasks or activities?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 9,
        "text": "How often are you easily distracted by extraneous stimuli?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 10,
        "text": "How often do you feel forgetful in daily activities?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 11,
        "text": "How often do you have trouble remaining focused on tasks that require sustained mental effort?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      },
      {
        "id": 12,
        "text": "How often do you avoid or dislike tasks that require a lot of mental effort over a long period of time?",
        "options": ["Never or rarely", "Occasionally", "Often", "Very often"]
      }
    ]
  }
]

  const [selectedIssue, setSelectedIssue] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userDisorders, setUserDisorders] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleIssueChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedIssue(selectedValue);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setUserDisorders([]);
    setQuizCompleted(false);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleAnswerSelect = (event) => {
    const selectedAnswer = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex + 1]: selectedAnswer,
    }));
  };

  const calculateQuizScore = async () => {
  let totalScore = 0;

  quizBank.forEach((issue) => {
    if (issue.issue === selectedIssue) {
      issue.questions.forEach((question) => {
        const userAnswer = answers[question.id];
        const answerIndex = question.options.indexOf(userAnswer);
        totalScore += answerIndex;
      });
    }
  });

  if (parseInt(totalScore) > 18) {
    // User may have the disorder
    const newDisorder = selectedIssue;
    console.log(totalScore)
    try {
      const name = localStorage.getItem('username');

      if (!name) {
        console.error('Username not found in localStorage');
        return;
      }

      const q = query(collection(db, 'users'), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const responseData = userDoc.data().response;
        const responseArray = responseData ? JSON.parse(responseData) : [];

        // Check if the new disorder is already in the user's response array
        if (!responseArray.includes(newDisorder)) {
          // Add the new disorder to the user's response array
          responseArray.push(newDisorder);

          // Update the user's response data in Firestore
          const updatedResponse = JSON.stringify(responseArray);
          await updateDoc(userDoc.ref, {
            response: updatedResponse
          });

          console.log("Disorder " + newDisorder +  " added to user's response.");
        }

        setUserDisorders(responseArray);
      } else {
        console.log('No user found with the name:', name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    // User doesn't have any disorders
    console.log('You do not have any disorders.');
  }

  setQuizCompleted(true);
};

  const currentIssue = quizBank.find((issue) => issue.issue === selectedIssue);

  return (
    <Box h="100vh" bg="gray.800" color="white" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box p={4} w="1400px" borderWidth="1px" borderRadius="lg">
        <Select value={selectedIssue} onChange={handleIssueChange} placeholder="Select Disorder" mb={4}>
          {quizBank.map((issue) => (
            <option key={issue.issue} value={issue.issue}>
              {issue.issue}
            </option>
          ))}
        </Select>
        {selectedIssue && (
          <Box>
            <Text>{currentIssue.questions[currentQuestionIndex].text}</Text>
            {currentIssue.questions[currentQuestionIndex].options.map((option, index) => (
              <div key={option}>
                <input
                  type="radio"
                  id={`${option}-${index}`}
                  name="answer"
                  value={option}
                  checked={answers[currentQuestionIndex + 1] === option}
                  onChange={handleAnswerSelect}
                />
                <label htmlFor={`${option}-${index}`}>{option}</label>
              </div>
            ))}
            <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentQuestionIndex === currentIssue.questions.length - 1} m='5'>
              Next
            </Button>
            {currentQuestionIndex === currentIssue.questions.length - 1 && (
              <Button onClick={calculateQuizScore}>
                  <Link to='/dashboard'>Finish test</Link>
              </Button>
            )}
          </Box>
        )}
        {quizCompleted && (
          <Box>
            {userDisorders.length > 0 ? (
              <Text>You have: {userDisorders.join(', ')}</Text>
            ) : (
              <Text>You do not have any disorders.</Text>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default QuizComponent;
