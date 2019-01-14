'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _elgamal = require('./crypto/elgamal.js');

var _elgamal2 = _interopRequireDefault(_elgamal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var BootBot = require('bootbot');
var axios = require('axios');


require('dotenv').config();

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send("This is a Facebook Messenger Bot for Decide.");
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    return res.send(req.query['hub.challenge']);
  }
  res.send('wrong token');
});

app.listen(app.get('port'), function () {
  console.log('Started on port', app.get('port'));
});

var config = {};

var bot = new BootBot({
  accessToken: process.env.ACCESS_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
  appSecret: process.env.APP_SECRET
});

bot.setPersistentMenu([{ type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Restart bot', payload: 'BOT_RESTART' }]);
bot.setGreetingText("Hello, I'm Decide-Locaste-Booth Bot. I'm here to help you vote with Decide. Click on the 'Get Started' button to begin.");

bot.setGetStartedButton(function (payload, chat) {
  chat.getUserProfile().then(function (user) {
    var welcome1 = 'Hello ' + user.first_name + ' !';
    var welcome2 = 'I\'m Decide-Locaste-Booth Bot, the Facebook Messenger virtual assistant for Decide.';
    var welcome3 = {
      text: 'In order to vote, first you need to log in with your Decide username and password.',
      buttons: [{ type: 'postback', title: 'Log in', payload: 'BOT_LOG_IN' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'web_url', url: "https://github.com/wadobo/decide/wiki/Como-funciona-Decide", title: "¿Cómo funciona Decide?" }]
    };
    var options = { typing: true };
    chat.say([welcome1, welcome2, welcome3], options);
  });
});

bot.on('postback:BOT_RESTART', function (payload, chat) {
  var restart = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var logout = function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(config.login === true)) {
                    _context.next = 4;
                    break;
                  }

                  chat.say("Logging out...", options);
                  _context.next = 4;
                  return axios.get('http://localhost:8000/rest-auth/logout/').then(function (res) {
                    config.login = false;
                    config.token = null;
                    config.username = null;
                    config.password = null;
                    config.userId = null;
                    config.allowedVotings = null;
                    config.actualVoting = null;
                    chat.say("Logged out successfully!", options);
                  }).catch(function (err) {
                    console.log(err.message);
                    var errorMessage1 = 'An error was produced while logging out...';
                    var errorMessage2 = {
                      text: 'Do you want to try again?',
                      buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_RESTART' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }]
                    };
                    chat.say([errorMessage1, errorMessage2], options);
                  });

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function logout() {
          return _ref2.apply(this, arguments);
        };
      }();

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              ;

              _context2.next = 3;
              return logout();

            case 3:
              chat.say("Starting a new conversation ...", options);
              chat.getUserProfile().then(function (user) {
                var welcome1 = 'Hello again ' + user.first_name + ' !';
                var welcome2 = 'I\'m Decide-Locaste-Booth Bot, the Facebook Messenger virtual assistant for Decide.';
                var welcome3 = {
                  text: 'In order to vote, first you need to log in with your Decide username and password.',
                  buttons: [{ type: 'postback', title: 'Log in', payload: 'BOT_LOG_IN' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'web_url', url: "https://github.com/wadobo/decide/wiki/Como-funciona-Decide", title: "¿Cómo funciona Decide?" }]
                };
                var options = { typing: true };
                chat.say([welcome1, welcome2, welcome3], options);
              });

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function restart() {
      return _ref.apply(this, arguments);
    };
  }();

  var options = { typing: true };

  restart();
});

bot.on('postback:BOT_LOG_IN', function (payload, chat) {
  var options = { typing: true };
  if (config.login === true) {
    chat.say("You're already logged in.", options);
  } else {
    var askUsername = function askUsername(convo) {
      var question = "Please, introduce your username.";

      var answer = function answer(payload, convo) {
        if (payload.message === undefined) {
          convo.say('Please wait...', options).then(function () {
            convo.say("You have interrupted the process of logging in!");
          });
          convo.end();
        } else {

          var username = payload.message.text;
          convo.set('username', username);
          convo.say('Got it!', options).then(function () {
            return askPassword(convo);
          });
        }
      };

      convo.ask(question, answer, options);
    };

    var askPassword = function askPassword(convo) {
      var question = "Now introduce your password.";

      var answer = function answer(payload, convo) {
        if (payload.message === undefined) {
          convo.say('Please wait...', options).then(function () {
            convo.say("You have interrupted the process of logging in!");
          });
          convo.end();
        } else {

          var password = payload.message.text;
          convo.set('password', password);
          convo.say('Ok!', options);

          var requestBody = {
            "username": convo.get('username'),
            "password": convo.get('password')
          };

          request.post('http://localhost:8000/rest-auth/login/', { json: requestBody }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              convo.getUserProfile().then(function (user) {
                var loginMessage1 = 'Well done, ' + user.first_name + ' !';
                var loginMessage2 = 'You have logged in successfully as ' + convo.get('username') + '!';
                var loginMessage3 = {
                  text: 'What would you want to do now?',
                  buttons: [{ type: 'postback', title: 'Access to a voting', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                };
                convo.say([loginMessage1, loginMessage2, loginMessage3], options).then(function () {
                  return convo.end();
                });
              });
              config.login = true;
              config.token = body.key;
              config.username = convo.get('username');
              config.password = convo.get('password');
            } else {
              convo.say('Ooops! Something went wrong.', options);
              var errorMessage = {
                text: 'Please, make sure you typed your username and password correctly.',
                buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_LOG_IN' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }]
              };
              convo.say(errorMessage, options).then(function () {
                return convo.end();
              });
            }
          });
        }
      };
      convo.ask(question, answer, options);
    };

    var message = 'Perfect!';
    chat.say(message, options).then(function () {
      return chat.conversation(function (convo) {
        askUsername(convo);
      });
    });
  }
});

bot.on('postback:BOT_LOG_OUT', function (payload, chat) {
  var options = { typing: true };
  if (config.login === true) {
    request.get('http://localhost:8000/rest-auth/logout/', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        config.login = false;
        config.token = null;
        config.username = null;
        config.password = null;
        config.userId = null;
        config.allowedVotings = null;
        config.actualVoting = null;
        chat.getUserProfile().then(function (user) {
          var logoutMessage1 = 'Logged out successfully!';
          var logoutMessage2 = 'Well, ' + user.first_name + ' , I hope I have been helpful.';
          var logoutMessage3 = {
            text: 'If you need me again, just let me know!',
            buttons: [{ type: 'postback', title: 'Restart bot', payload: 'BOT_RESTART' }]
          };
          chat.say([logoutMessage1, logoutMessage2, logoutMessage3], options);
        });
      } else {
        var errorMessage1 = 'An error was produced while logging out...';
        var errorMessage2 = {
          text: 'Do you want to try again?',
          buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_LOG_OUT' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }]
        };
        chat.say([errorMessage1, errorMessage2], options);
      }
    });
  } else {
    chat.say("You are not logged in!", options);
  }
});

bot.on('postback:BOT_GET_VOTING', function (payload, chat) {
  var options = { typing: true };
  if (config.login === true) {
    var getAllowedVotings = function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(config.userId === null || config.userId === undefined)) {
                  _context3.next = 5;
                  break;
                }

                _context3.next = 3;
                return axios.post('http://localhost:8000/authentication/getuser/', { 'token': config.token }).then(function (res) {
                  config.userId = res.data.id;
                  return axios.get('http://localhost:8000/census/?voter_id=' + config.userId);
                }).then(function (res) {
                  config.allowedVotings = res.data.voting;
                }).catch(function (err) {
                  console.log(err.message);
                });

              case 3:
                _context3.next = 7;
                break;

              case 5:
                _context3.next = 7;
                return axios.get('http://localhost:8000/census/?voter_id=' + config.userId).then(function (res) {
                  config.allowedVotings = res.data.voting;
                }).catch(function (err) {
                  console.log(err.message);
                });

              case 7:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function getAllowedVotings() {
        return _ref3.apply(this, arguments);
      };
    }();

    var conversation = function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var _this = this;

        var errorMessage1, errorMessage2, message1, message2, i;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return getAllowedVotings();

              case 2:
                if (!(config.allowedVotings === undefined || config.allowedVotings === null)) {
                  _context5.next = 8;
                  break;
                }

                errorMessage1 = 'An error was produced while performing this operation...';
                errorMessage2 = {
                  text: 'Do you want to try again?',
                  buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                };

                chat.say([errorMessage1, errorMessage2], options);
                _context5.next = 15;
                break;

              case 8:
                if (!(config.allowedVotings.length === 0)) {
                  _context5.next = 14;
                  break;
                }

                message1 = 'I\'m sorry. There aren\'t votings in which you can participate.';
                message2 = {
                  text: 'What would you want to do now?',
                  buttons: [{ type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                };

                chat.say([message1, message2], options);
                _context5.next = 15;
                break;

              case 14:
                return _context5.delegateYield( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                  var votingsIds, replies, votings, activeVotings, chooseVoting, askConfirmation, message;
                  return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          votingsIds = config.allowedVotings.map(String);
                          replies = [];
                          votings = [];
                          activeVotings = [];
                          i = 0;

                        case 5:
                          if (!(i < votingsIds.length)) {
                            _context4.next = 11;
                            break;
                          }

                          _context4.next = 8;
                          return axios.get('http://localhost:8000/voting/?id=' + votingsIds[i].toString()).then(function (res) {
                            var title = res.data[0].name;
                            var isActive = res.data[0].start_date !== null && res.data[0].end_date === null ? true : false;
                            var image = !isActive ? "https://http2.mlstatic.com/adventure-kidz-banz-age-2-5-gafas-de-sol-rockin-red-D_NQ_NP_638979-MLM26845819305_022018-O.jpg" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHsXY1PIZ4MgKi0XWj0uIOUks9TuP75Lkphk2bNLHNE2leQVF2BQ";

                            var reply = {
                              "content_type": "text",
                              "title": title,
                              "image_url": image,
                              "payload": "BOT_PICK_VOTING_" + votingsIds[i].toString()
                            };
                            replies.push(reply);

                            votings[title] = votingsIds[i];

                            if (isActive) {
                              activeVotings.push(title);
                            }
                          }).catch(function (err) {
                            console.log(err.message);
                          });

                        case 8:
                          i++;
                          _context4.next = 5;
                          break;

                        case 11:
                          chooseVoting = function chooseVoting(convo) {

                            var question = {
                              text: 'Here\'s a list of the votings in which you can participate. The active votings are marked in green, while the inactive are marked in red. Please, choose an active voting!',
                              quickReplies: replies
                            };

                            var answer = function answer(payload, convo) {
                              if (payload.message === undefined) {
                                convo.say('Please wait...', options).then(function () {
                                  convo.say("You have interrupted the process of choosing a voting!");
                                });
                                convo.end();
                              } else {
                                var voting = payload.message.text;
                                var allVotings = (0, _keys2.default)(votings);

                                if (!allVotings.includes(voting)) {
                                  var _errorMessage = 'This voting does not exist!!!';
                                  var _errorMessage2 = {
                                    text: 'What would you want to do now?',
                                    buttons: [{ type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                                  };
                                  convo.say([_errorMessage, _errorMessage2], options).then(function () {
                                    convo.end();
                                  });
                                } else if (!activeVotings.includes(voting)) {
                                  var _errorMessage3 = 'You have chosen an inactive voting.';
                                  var _errorMessage4 = 'I told you not to do that!';
                                  var errorMessage3 = {
                                    text: 'What would you want to do now?',
                                    buttons: [{ type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                                  };
                                  convo.say([_errorMessage3, _errorMessage4, errorMessage3], options).then(function () {
                                    convo.end();
                                  });;
                                } else {
                                  convo.set('votingName', voting);
                                  var votingId = votings[convo.get('votingName')];
                                  convo.set('votingId', votingId);

                                  convo.say('Good choice!', options).then(function () {
                                    return askConfirmation(convo);
                                  });
                                }
                              }
                            };

                            convo.ask(question, answer, options);
                          };

                          askConfirmation = function askConfirmation(convo) {

                            convo.getUserProfile().then(function (user) {
                              var question = {
                                text: 'So ' + user.first_name + ' , do you want to participate in the voting \'' + convo.get('votingName') + "'?",
                                quickReplies: ["Yes", "No"]
                              };

                              var answer = function answer(payload, convo) {
                                if (payload.message === undefined) {
                                  convo.say('Please wait...', options).then(function () {
                                    convo.say("You have interrupted the process of choosing a voting!");
                                  });
                                  convo.end();
                                } else {
                                  var reply = payload.message.text;

                                  if (reply == "Yes" || reply == 'yes' || reply == 'YES') {
                                    config.actualVoting = convo.get('votingId');
                                    var _message = 'Ok, ' + user.first_name + '. ';
                                    convo.sendButtonTemplate(_message, [{ type: 'postback', title: 'Open the voting', payload: 'BOT_OPEN_VOTING' }], options).then(function () {
                                      return convo.end();
                                    });
                                  } else if (reply == "No" || reply == 'no' || reply == 'NO') {
                                    var _message2 = 'Got it.';
                                    var _message3 = {
                                      text: 'What would you want to do now?',
                                      buttons: [{ type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                                    };
                                    convo.say([_message2, _message3], options).then(function () {
                                      return convo.end();
                                    });
                                  } else {
                                    var _message4 = 'I didn\'t understand that.';
                                    convo.sendButtonTemplate(_message4, [{ type: 'postback', title: 'Help', payload: 'BOT_HELP' }], options).then(function () {
                                      return convo.end();
                                    });
                                  }
                                }
                              };
                              convo.ask(question, answer, options);
                            });
                          };

                          message = 'Ok';

                          chat.say(message, options).then(function () {
                            return chat.conversation(function (convo) {
                              chooseVoting(convo);
                            });
                          });

                        case 15:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, _this);
                })(), 't0', 15);

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function conversation() {
        return _ref4.apply(this, arguments);
      };
    }();

    ;

    ;
    conversation();
  } else {
    var errorMessage = {
      text: 'You must be logged in in order to access a voting.',
      buttons: [{ type: 'postback', title: 'Log in', payload: 'BOT_LOG_IN' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }]
    };
    chat.say(errorMessage, options);
  }
});

bot.on('postback:BOT_OPEN_VOTING', function (payload, chat) {
  var options = { typing: true };
  if (config.actualVoting === null || config.actualVoting === undefined) {
    var errorMessage1 = {
      text: 'Please, select a voting:',
      buttons: [{ type: 'postback', title: 'Access a voting', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Restart bot', payload: 'BOT_RESTART' }]
    };
    chat.say([errorMessage1], options);
  } else {
    chat.getUserProfile().then(function (user) {
      var message1 = "Listen carefully!";
      var message2 = "You are about to participate in this voting.";
      var message3 = "The question of the voting will appear as soon as you press the Start button.";
      var message4 = "Read it carefully and choose an answer.";
      var message5 = 'Please, ' + user.first_name + ', use the given options to answer the question!';
      var message6 = "Don't type anything or your answer won't be valid. ";
      var message7 = "In the end, you will have to confirm your vote.";
      var message8 = {
        text: 'Is everything clear, ' + user.first_name + '? Are you sure you want to continue?',
        buttons: [{ type: 'postback', title: 'Start', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'Access another voting', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
      };
      chat.say([message1, message2, message3, message4, message5, message6, message7, message8], options);
    });
  }
});

bot.on('postback:BOT_START_VOTING', function (payload, chat) {
  var options = { typing: true };
  if (config.actualVoting === null || config.actualVoting === undefined) {
    var errorMessage1 = {
      text: 'Please, select a voting:',
      buttons: [{ type: 'postback', title: 'Access a voting', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Restart bot', payload: 'BOT_RESTART' }]
    };
    chat.say([errorMessage1], options);
  } else {
    var getActualVoting = function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return axios.get('http://localhost:8000/voting/?id=' + config.actualVoting).then(function (res) {
                  title = res.data[0].name;
                  description = res.data[0].desc;
                  key = res.data[0].pub_key;
                  question = res.data[0].question.desc;
                  choices = res.data[0].question.options;
                }).catch(function (err) {
                  console.log(err.message);
                });

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function getActualVoting() {
        return _ref5.apply(this, arguments);
      };
    }();

    var showQuestion = function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var elements, min, i, element, template, message1, message2, message3, message4;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return getActualVoting();

              case 2:

                config.votingKey = [];
                config.votingKey['p'] = key.p;
                config.votingKey['g'] = key.g;
                config.votingKey['y'] = key.y;

                elements = [];

                config.choice = [];
                min = choices.length > 4 ? 4 : choices.length;

                for (i = 0; i < min; i++) {
                  element = {
                    "title": "Option №" + choices[i].number,
                    "subtitle": choices[i].option,
                    "buttons": [{
                      "title": "Vote №" + choices[i].number,
                      "type": "postback",
                      "webview_height_ratio": "tall",
                      "payload": "BOT_VOTE_" + (i + 1)
                    }]
                  };

                  config.choice[i + 1] = choices[i].number;
                  elements.push(element);
                }

                template = {
                  "template_type": "list",
                  "top_element_style": "compact",
                  "elements": elements,
                  "buttons": [{
                    "title": "Cancel",
                    "type": "postback",
                    "webview_height_ratio": "full",
                    "payload": "BOT_CANCEL_VOTING"
                  }]
                };
                message1 = title + ":";
                message2 = "Here is a short description of the voting:";
                message3 = "Here is the question:";
                message4 = "Answer the question by choosing one of the following options:";

                if (description !== null && description != "") {

                  chat.say([message1, message2, description, message3, question, message4], options).then(function () {
                    chat.sendTemplate(template, options);
                  });
                } else {
                  chat.say([message1, message3, question, message4], options).then(function () {
                    chat.sendTemplate(template, options);
                  });
                }

              case 16:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function showQuestion() {
        return _ref6.apply(this, arguments);
      };
    }();

    var title = null;
    var description = null;
    var key = null;
    var question = null;
    var choices = null;

    showQuestion();
  }
});

bot.on('postback:BOT_CANCEL_VOTING', function (payload, chat) {
  var options = { typing: true };
  if (config.actualVoting === null || config.actualVoting === undefined) {
    var errorMessage1 = {
      text: 'Please, select a voting:',
      buttons: [{ type: 'postback', title: 'Access a voting', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Restart bot', payload: 'BOT_RESTART' }]
    };
    chat.say([errorMessage1], options);
  } else {
    config.actualVoting = null;
    config.votingKey = null;
    config.choice = null;
    var message1 = "You have left this voting.";
    var message2 = {
      text: 'What do you want to do now?',
      buttons: [{ type: 'postback', title: 'Access another voting', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
    };
    chat.say([message1, message2], options);
  }
});

bot.on('postback:BOT_VOTE_1', function (payload, chat) {
  var options = { typing: true };

  if (config.votingKey !== null && config.votingKey !== undefined) {
    var generatePrivateKey = function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return _elgamal2.default.generatePrivateKey(prime);

              case 2:
                privateKey = _context8.sent;

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function generatePrivateKey() {
        return _ref7.apply(this, arguments);
      };
    }();

    var inicializeElGamal = function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
        var egInstance;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return generatePrivateKey();

              case 2:
                egInstance = new _elgamal2.default(prime, generator, publicKey, privateKey);
                _context9.next = 5;
                return egInstance.encryptAsync(vote);

              case 5:
                encryptedVote = _context9.sent;

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function inicializeElGamal() {
        return _ref8.apply(this, arguments);
      };
    }();

    var encryptVote = function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return inicializeElGamal();

              case 2:
                encryptedVoteA = encryptedVote.a + '';
                encryptedVoteB = encryptedVote.b + '';

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function encryptVote() {
        return _ref9.apply(this, arguments);
      };
    }();

    var sendVote = function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return encryptVote();

              case 2:
                _context11.next = 4;
                return axios.post('http://localhost:8000/store/', { 'voting': config.actualVoting, "voter": config.userId, "vote": { "a": encryptedVoteA, "b": encryptedVoteB } }, { auth: { username: config.username, password: config.password } }).then(function (res) {
                  config.actualVoting = null;
                  config.votingKey = null;
                  config.choice = null;
                  var message1 = "Congratulations! Your vote has been processed!";
                  var message2 = "You can still change your vote if you want to.";
                  var message3 = "Just open this voting again and choose your new option.";
                  var message4 = {
                    text: 'So, what do you want to do now?',
                    buttons: [{ type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([message1, message2, message3, message4], options);
                }).catch(function (err) {
                  console.log(err.message);
                  config.votingKey = null;
                  config.choice = null;
                  var errorMessage1 = "Ooops!";
                  var errorMessage2 = "An unexpected error occurred while processing your vote!";
                  var errorMessage3 = {
                    text: 'What do you want to do now?',
                    buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([errorMessage1, errorMessage2, errorMessage3], options);
                });

              case 4:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function sendVote() {
        return _ref10.apply(this, arguments);
      };
    }();

    chat.say("Processing your vote...", options).then(function () {
      chat.say("Please wait.", options);
    });

    var encryptedVote = null;
    var encryptedVoteA = null;
    var encryptedVoteB = null;
    var privateKey = null;

    var prime = config.votingKey.p;
    var generator = config.votingKey.g;
    var publicKey = config.votingKey.y;
    var vote = parseInt(config.choice[1]);

    ;

    ;

    ;

    sendVote();
  } else {
    var message1 = "You have left this voting. You can no longer submit your vote.";
    var message2 = {
      text: 'Do you want to enter this voting again?',
      buttons: [{ type: 'postback', title: 'Enter again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the other votings ', payload: 'BOT_GET_VOTING' }]
    };
    chat.say([message1, message2], options);
  }
});

bot.on('postback:BOT_VOTE_2', function (payload, chat) {
  var options = { typing: true };

  if (config.votingKey !== null && config.votingKey !== undefined) {
    var generatePrivateKey = function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return _elgamal2.default.generatePrivateKey(prime);

              case 2:
                privateKey = _context12.sent;

              case 3:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function generatePrivateKey() {
        return _ref11.apply(this, arguments);
      };
    }();

    var inicializeElGamal = function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
        var egInstance;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return generatePrivateKey();

              case 2:
                egInstance = new _elgamal2.default(prime, generator, publicKey, privateKey);
                _context13.next = 5;
                return egInstance.encryptAsync(vote);

              case 5:
                encryptedVote = _context13.sent;

              case 6:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function inicializeElGamal() {
        return _ref12.apply(this, arguments);
      };
    }();

    var encryptVote = function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return inicializeElGamal();

              case 2:
                encryptedVoteA = encryptedVote.a + '';
                encryptedVoteB = encryptedVote.b + '';

              case 4:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function encryptVote() {
        return _ref13.apply(this, arguments);
      };
    }();

    var sendVote = function () {
      var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
        return _regenerator2.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return encryptVote();

              case 2:
                _context15.next = 4;
                return axios.post('http://localhost:8000/store/', { 'voting': config.actualVoting, "voter": config.userId, "vote": { "a": encryptedVoteA, "b": encryptedVoteB } }, { auth: { username: config.username, password: config.password } }).then(function (res) {
                  config.actualVoting = null;
                  config.votingKey = null;
                  config.choice = null;
                  var message1 = "Congratulations! Your vote has been processed!";
                  var message2 = "You can still change your vote if you want to.";
                  var message3 = "Just open this voting again and choose your new option.";
                  var message4 = {
                    text: 'So, what do you want to do now?',
                    buttons: [{ type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([message1, message2, message3, message4], options);
                }).catch(function (err) {
                  console.log(err.message);
                  config.votingKey = null;
                  config.choice = null;
                  var errorMessage1 = "Ooops!";
                  var errorMessage2 = "An unexpected error occurred while processing your vote!";
                  var errorMessage3 = {
                    text: 'What do you want to do now?',
                    buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([errorMessage1, errorMessage2, errorMessage3], options);
                });

              case 4:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      return function sendVote() {
        return _ref14.apply(this, arguments);
      };
    }();

    chat.say("Processing your vote...", options).then(function () {
      chat.say("Please wait.", options);
    });

    var encryptedVote = null;
    var encryptedVoteA = null;
    var encryptedVoteB = null;
    var privateKey = null;

    var prime = config.votingKey.p;
    var generator = config.votingKey.g;
    var publicKey = config.votingKey.y;
    var vote = parseInt(config.choice[2]);

    ;

    ;

    ;

    sendVote();
  } else {
    var message1 = "You have left this voting. You can no longer submit your vote.";
    var message2 = {
      text: 'Do you want to enter this voting again?',
      buttons: [{ type: 'postback', title: 'Enter again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the other votings ', payload: 'BOT_GET_VOTING' }]
    };
    chat.say([message1, message2], options);
  }
});

bot.on('postback:BOT_VOTE_3', function (payload, chat) {
  var options = { typing: true };

  if (config.votingKey !== null && config.votingKey !== undefined) {
    var generatePrivateKey = function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return _elgamal2.default.generatePrivateKey(prime);

              case 2:
                privateKey = _context16.sent;

              case 3:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      return function generatePrivateKey() {
        return _ref15.apply(this, arguments);
      };
    }();

    var inicializeElGamal = function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
        var egInstance;
        return _regenerator2.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return generatePrivateKey();

              case 2:
                egInstance = new _elgamal2.default(prime, generator, publicKey, privateKey);
                _context17.next = 5;
                return egInstance.encryptAsync(vote);

              case 5:
                encryptedVote = _context17.sent;

              case 6:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      return function inicializeElGamal() {
        return _ref16.apply(this, arguments);
      };
    }();

    var encryptVote = function () {
      var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
        return _regenerator2.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return inicializeElGamal();

              case 2:
                encryptedVoteA = encryptedVote.a + '';
                encryptedVoteB = encryptedVote.b + '';

              case 4:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      return function encryptVote() {
        return _ref17.apply(this, arguments);
      };
    }();

    var sendVote = function () {
      var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return encryptVote();

              case 2:
                _context19.next = 4;
                return axios.post('http://localhost:8000/store/', { 'voting': config.actualVoting, "voter": config.userId, "vote": { "a": encryptedVoteA, "b": encryptedVoteB } }, { auth: { username: config.username, password: config.password } }).then(function (res) {
                  config.actualVoting = null;
                  config.votingKey = null;
                  config.choice = null;
                  var message1 = "Congratulations! Your vote has been processed!";
                  var message2 = "You can still change your vote if you want to.";
                  var message3 = "Just open this voting again and choose your new option.";
                  var message4 = {
                    text: 'So, what do you want to do now?',
                    buttons: [{ type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([message1, message2, message3, message4], options);
                }).catch(function (err) {
                  console.log(err.message);
                  config.votingKey = null;
                  config.choice = null;
                  var errorMessage1 = "Ooops!";
                  var errorMessage2 = "An unexpected error occurred while processing your vote!";
                  var errorMessage3 = {
                    text: 'What do you want to do now?',
                    buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([errorMessage1, errorMessage2, errorMessage3], options);
                });

              case 4:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      return function sendVote() {
        return _ref18.apply(this, arguments);
      };
    }();

    chat.say("Processing your vote...", options).then(function () {
      chat.say("Please wait.", options);
    });

    var encryptedVote = null;
    var encryptedVoteA = null;
    var encryptedVoteB = null;
    var privateKey = null;

    var prime = config.votingKey.p;
    var generator = config.votingKey.g;
    var publicKey = config.votingKey.y;
    var vote = parseInt(config.choice[3]);

    ;

    ;

    ;

    sendVote();
  } else {
    var message1 = "You have left this voting. You can no longer submit your vote.";
    var message2 = {
      text: 'Do you want to enter this voting again?',
      buttons: [{ type: 'postback', title: 'Enter again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the other votings ', payload: 'BOT_GET_VOTING' }]
    };
    chat.say([message1, message2], options);
  }
});

bot.on('postback:BOT_VOTE_4', function (payload, chat) {
  var options = { typing: true };

  if (config.votingKey !== null && config.votingKey !== undefined) {
    var generatePrivateKey = function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
        return _regenerator2.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return _elgamal2.default.generatePrivateKey(prime);

              case 2:
                privateKey = _context20.sent;

              case 3:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      return function generatePrivateKey() {
        return _ref19.apply(this, arguments);
      };
    }();

    var inicializeElGamal = function () {
      var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
        var egInstance;
        return _regenerator2.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return generatePrivateKey();

              case 2:
                egInstance = new _elgamal2.default(prime, generator, publicKey, privateKey);
                _context21.next = 5;
                return egInstance.encryptAsync(vote);

              case 5:
                encryptedVote = _context21.sent;

              case 6:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      return function inicializeElGamal() {
        return _ref20.apply(this, arguments);
      };
    }();

    var encryptVote = function () {
      var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
        return _regenerator2.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return inicializeElGamal();

              case 2:
                encryptedVoteA = encryptedVote.a + '';
                encryptedVoteB = encryptedVote.b + '';

              case 4:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      return function encryptVote() {
        return _ref21.apply(this, arguments);
      };
    }();

    var sendVote = function () {
      var _ref22 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return encryptVote();

              case 2:
                _context23.next = 4;
                return axios.post('http://localhost:8000/store/', { 'voting': config.actualVoting, "voter": config.userId, "vote": { "a": encryptedVoteA, "b": encryptedVoteB } }, { auth: { username: config.username, password: config.password } }).then(function (res) {
                  config.actualVoting = null;
                  config.votingKey = null;
                  config.choice = null;
                  var message1 = "Congratulations! Your vote has been processed!";
                  var message2 = "You can still change your vote if you want to.";
                  var message3 = "Just open this voting again and choose your new option.";
                  var message4 = {
                    text: 'So, what do you want to do now?',
                    buttons: [{ type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Help', payload: 'BOT_HELP' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([message1, message2, message3, message4], options);
                }).catch(function (err) {
                  console.log(err.message);
                  config.votingKey = null;
                  config.choice = null;
                  var errorMessage1 = "Ooops!";
                  var errorMessage2 = "An unexpected error occurred while processing your vote!";
                  var errorMessage3 = {
                    text: 'What do you want to do now?',
                    buttons: [{ type: 'postback', title: 'Try again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the votings again', payload: 'BOT_GET_VOTING' }, { type: 'postback', title: 'Log out', payload: 'BOT_LOG_OUT' }]
                  };
                  chat.say([errorMessage1, errorMessage2, errorMessage3], options);
                });

              case 4:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      return function sendVote() {
        return _ref22.apply(this, arguments);
      };
    }();

    chat.say("Processing your vote...", options).then(function () {
      chat.say("Please wait.", options);
    });

    var encryptedVote = null;
    var encryptedVoteA = null;
    var encryptedVoteB = null;
    var privateKey = null;

    var prime = config.votingKey.p;
    var generator = config.votingKey.g;
    var publicKey = config.votingKey.y;
    var vote = parseInt(config.choice[4]);

    ;

    ;

    ;

    sendVote();
  } else {
    var message1 = "You have left this voting. You can no longer submit your vote.";
    var message2 = {
      text: 'Do you want to enter this voting again?',
      buttons: [{ type: 'postback', title: 'Enter again', payload: 'BOT_START_VOTING' }, { type: 'postback', title: 'See the other votings ', payload: 'BOT_GET_VOTING' }]
    };
    chat.say([message1, message2], options);
  }
});

bot.on('postback:BOT_HELP', function (payload, chat) {
  var options = { typing: true };

  var helpMessage1 = "Hello, I'm Decide-Locaste-Booth Bot.";
  var helpMessage2 = "You can use me to participate in votings using the Decide platform.";
  var helpMessage3 = "Here is a short tutorial of how to interact with me:";
  var helpMessage4 = "Sadly, I am not intelligent enough to understand and answer your text messages.";
  var helpMessage5 = "That's why I will always send you buttons that you can use to interact with me.";
  var helpMessage6 = "Here are the most important ones:";
  var helpMessage7 = "->'Log in'<- : use this button to log in into your Decide account. You'll have to type your Decide username and password.";
  var helpMessage8 = "->'Access to a voting'<- : use this button to see the votings that are available for you. To participate in a voting, select one from the list. You'll have to select a voting that is active (marked in green).";
  var helpMessage9 = "->'Open'<- : use this button to open the selected voting. You will receive instructions how to choose and submit your vote.";
  var helpMessage10 = "->'Start'<- : use this button to see the question and the possible options.";
  var helpMessage11 = "->'Vote'<- : use this button to vote the corresponding option";
  var helpMessage12 = "->'Cancel'<- : use this button to close the voting without submitting a vote";
  var helpMessage13 = "->'Log out'<- : use this button to log out of the Decide platform.";
  var helpMessage14 = "->'Restart bot'<- : use this button to restart the conversation with me.";
  var helpMessage15 = "That's all. I hope I have been helpful.";

  chat.say([helpMessage1, helpMessage2, helpMessage3, helpMessage4, helpMessage5, helpMessage6, helpMessage7, helpMessage8, helpMessage9, helpMessage10, helpMessage11, helpMessage12, helpMessage13, helpMessage14, helpMessage15], options);
});

bot.start();