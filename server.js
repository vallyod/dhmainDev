const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.static('styles'));

app.get('/', (req, res) => {
  //res.sendFile('public/FP.html');
  res.sendFile(join(__dirname, 'pages', 'game.html'));
});

const clients = new Set();

var userAnswers = []
io.on("connection", (socket) => {
  // Create user
  const user = {
    name: 'None Given',
    points: 0
  };

  socket.on("newUser", (name) => { 
    user.name = name

    clients.add(user);

    clients.forEach((existingUser) => {
      socket.emit('userJoined', existingUser);
    });

    socket.broadcast.emit('userJoined', user);
  })

  socket.on("userPicked", (question, choice) => {
    console.log("Question recieved")
    questions.forEach((eQuestion) => {
      if (eQuestion.question == question) {
        if (eQuestion.correct == choice) {
          user.points += 1
          io.emit("awardPoints", user)
        }
      }
    });
  });

  socket.on('disconnect', () => {
    clients.delete(user);
  
    io.emit('userDeleted', user);
  });
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

var questions = [
  {
      question: "Many people left farms and went to cities to find work in factories in a process called?",
      answers: [
          "Urbanization",
          "Factory system",
          "Conglomeration",
          "Industrialization"
      ],
      correct: "Urbanization"
  },
  {
      question: "What is a 'soviet'?",
      answers: [
          "A militia",
          "A political party",
          "A worker's council",
          "The Russian legislature"
      ],
      correct: "A worker's council"
  },
  {
      question: "Which industry was the first to make use of the Industrial Revolution's advancements?",
      answers: [
          "Steel making",
          "Railroads",
          "Farming",
          "Textiles"
      ],
      correct: "Textiles"
  },
  {
      question: "Criticisms of the Roman Catholic Church, Charles summoned Martin Luther to what?",
      answers: [
          "The Diet of Worms",
          "The Estates General",
          "The Council of Trent",
          "The Augsburg Confession"
      ],
      correct: "The Diet of Worms"
  },
  {
      question: "Which of the following is the oldest lake in the world?",
      answers: [
          "The Nile Lake",
          "The Michigan Lake",
          "The Baikal Lake",
          "The Tigress Lake"
      ],
      correct: "The Baikal Lake"
  },
  {
      question: "How many rings does the planet Saturn have?",
      answers: [
          "1",
          "2",
          "4",
          "8",
          "218"
      ],
      correct: "8"
  },
  {
      question: "What is the value of 1+2+3+4+5+6+7+8 (level 1)?",
      answers: [
          "30",
          "32",
          "34",
          "36"
      ],
      correct: "36"
  },
  {
      question: "A bucket that is 1/2 full contains 9 L of maple syrup. What is the capacity of the bucket, in litres? (level 4)",
      answers: [
          "9",
          "12",
          "15",
          "18"
      ],
      correct: "18"
  },
  {
      question: "The sum of four consecutive odd integers is 200. What is the largest of these four integers? (level 1)",
      answers: [
          "47",
          "49",
          "51",
          "53"
      ],
      correct: "53"
  },
  {
      question: "It takes 18 doodads to make 5 widgets. It takes 11 widgets to make 4 thingamabobs. How many doodads does it take to make 80 thingamabobs? (level 1, no calculator MF)",
      answers: [
          "792",
          "88",
          "3960",
          "80"
      ],
      correct: "792"
  },
  {
      question: "How old was Queen Victoria when she died (level -2)?",
      answers: [
          "101",
          "100",
          "98",
          "96"
      ],
      correct: "96"
  },
  {
      question: "What is the name of the galaxy we are in?",
      answers: [
          "The Milky Way",
          "The Ocky Way",
          "The Gyatt galaxy",
          "The Skibidi Galaxy"
      ],
      correct: "The Milky Way"
  },
  {
      question: "Which of the following is not one of Euler's formulas?",
      answers: [
          "e^(iπ) + 1 = 0",
          "e^X + sin(x) = v + cos(x)",
          "e^(ix) = cos(x) + sin(x)",
          "V - e + f = 2"
      ],
      correct: "e^X + sin(x) = v + cos(x)"
  },
  {
      question: "Which of the following is the odd one out?",
      answers: [
          "(a)sin(b+c)",
          "(1/2)(base)(height)",
          "12×|→AB|×|→AC|×sin θ",
          "(1/2)(a)(b)sin(C)"
      ],
      correct: "12×|→AB|×|→AC|×sin θ"
  },
  {
      question: "What is the derivative of sec^2(x)?",
      answers: [
          "tan^2(x)",
          "sec(x)",
          "cos^2(x)sin^2(x)",
          "sec^2(x)tan(x)"
      ],
      correct: "sec^2(x)tan(x)"
  }
];

setInterval(() => {
  var randomIndex = Math.floor(Math.random() * questions.length);
  var randomQuestion = questions[randomIndex];

  var questionText = randomQuestion.question
  var possibleAnswers = randomQuestion.answers;

  var tempArray = [
    question = questionText,
    answers = possibleAnswers
  ]
  
  io.emit("skibidiQuestions", tempArray)
}, 5000);