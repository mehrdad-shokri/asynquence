(function(name,context,definition){
	if (typeof module !== "undefined" && module.exports) module.exports = definition();
	else if (typeof define === "function" && define.amd) define(definition);
	else context[name] = definition(name,context);
})("ASQ_tests",this,function(name,context){
	"use strict";

	function defineTests(ASQ,doneLogMsg) {

		function asyncDelayFn(delay) {
			return function(done) {
				setTimeout(done,delay);
			};
		}

		function PASS(testDone,testLabel) {
			doneLogMsg(testLabel + ": PASSED")();
			testDone();
		}

		function FAIL(testDone,testLabel) {
			doneLogMsg(testLabel + ": FAILED")();
			testDone.fail.apply(testDone,ARRAY_SLICE.call(arguments,2));
		}

		var ARRAY_SLICE = Array.prototype.slice;
		var tests = [];

		tests.push(function(testDone){
			var label = "Test  #1", timeout;

			ASQ()
			.then(asyncDelayFn(100))
			.then(function(){
				clearTimeout(timeout);
				PASS(testDone,label);
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test  #2", timeout;

			ASQ()
			.then(function(done){
				asyncDelayFn(100)(function(){
					done("Hello World");
				});
			})
			.then(function(_,msg1){
				clearTimeout(timeout);
				if (msg1 === "Hello World") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test  #3", timeout;

			ASQ()
			.then(function(done){
				asyncDelayFn(100)(function(){
					done("Hello");
				});
			})
			.then(function(done,msg1){
				asyncDelayFn(100)(function(){
					done(msg1,"World");
				});
			})
			.then(function(_,msg1,msg2){
				clearTimeout(timeout);
				if (msg1 === "Hello" && msg2 === "World") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test  #4", timeout;

			ASQ()
			.then(function(done){
				asyncDelayFn(100)(function(){
					done.fail("Hello","World");
				});
			})
			.then(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg1,msg2){
				clearTimeout(timeout);
				if (msg1 === "Hello" && msg2 === "World") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test  #5", timeout;

			ASQ()
			.then(function(done){
				done.a.b; // throwing JS error to make sure it's caught and propagated
			})
			.then(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg1){
				clearTimeout(timeout);
				if (msg1 instanceof Error) {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #5b";

			ASQ()
			.then(function(done){
				// throwing JS error to make sure it's caught and propagated
				throw ASQ.messages("Oops","I","did","it","again!");
			})
			.then(function(){
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg1,msg2,msg3,msg4,msg5){
				if (msg1 === "Oops" &&
					msg2 === "I" &&
					msg3 === "did" &&
					msg4 === "it" &&
					msg5 === "again!"
				) {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});
		});
		tests.push(function(testDone){
			var label = "Test #5c";

			ASQ()
			.then(function(done){
				// throwing JS error to make sure it's caught and propagated
				throw ASQ.messages("Oops","I","did","it","again!");
			})
			.or(function(){
				throw ASQ.messages("Oh","yeah!");
			})
			.or(function(msg1,msg2,msg3,msg4,msg5,msg6,msg7){
				if (msg1 === "Oops" &&
					msg2 === "I" &&
					msg3 === "did" &&
					msg4 === "it" &&
					msg5 === "again!" &&
					msg6 === "Oh" &&
					msg7 === "yeah!"
				) {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});
		});
		tests.push(function(testDone){
			var label = "Test  #6", timeout;

			ASQ()
			.then(asyncDelayFn(100))
			.gate(
				asyncDelayFn(800),
				asyncDelayFn(600),
				asyncDelayFn(700)
			)
			.then(function(){
				clearTimeout(timeout);
				PASS(testDone,label);
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test  #7", timeout;

			ASQ()
			.then(function(done){
				asyncDelayFn(100)(function(){
					done("msg1","msg2");
				});
			})
			.gate(
				function(done,msg1,msg2){
					asyncDelayFn(200)(function(){
						done(msg1,msg2,"Hello");
					});
				},
				function(done,msg1,msg2){
					asyncDelayFn(100)(function(){
						done(msg1+" "+msg2+" World");
					});
				}
			)
			.then(function(_,msg1,msg2){
				clearTimeout(timeout);

				if (ASQ.isMessageWrapper(msg1) &&
					msg1[0] === "msg1" &&
					msg1[1] === "msg2" &&
					msg1[2] === "Hello" &&
					msg2 === "msg1 msg2 World"
				) {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test  #8", timeout;

			ASQ()
			.then(asyncDelayFn(100))
			.gate(
				function(done){
					asyncDelayFn(100)(function(){
						done("Hello");
					});
				},
				function(done){
					asyncDelayFn(200)(function(){
						done.fail("World");
					});
				}
			)
			.then(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg1){
				clearTimeout(timeout);

				if (msg1 === "World") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test  #9", timeout;

			ASQ()
			.then(asyncDelayFn(100))
			.then(function(done){
				ASQ()
				.then(asyncDelayFn(100))
				.then(function(done){
					asyncDelayFn(100)(function(){
						done("Hello");
					});
				})
				.pipe(done);
			})
			.then(function(done,msg1){
				clearTimeout(timeout);

				if (msg1 === "Hello") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #10", timeout;

			ASQ()
			.then(asyncDelayFn(100))
			.then(function(done){
				ASQ()
				.then(asyncDelayFn(100))
				.then(function(done){
					asyncDelayFn(100)(function(){
						done.fail("Hello");
					});
				})
				.pipe(done);
			})
			.then(function(done){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg1){
				clearTimeout(timeout);

				if (msg1 === "Hello") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #11", timeout;

			ASQ()
			.then(function(done){
				done("Hello");
			})
			.then(function(done,msg1){
				clearTimeout(timeout);

				if (msg1 === "Hello") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #12", timeout;

			ASQ()
			.then(function(done){
				done.fail("Hello");
			})
			.then(function(done){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg1){
				clearTimeout(timeout);

				if (msg1 === "Hello") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #13", timeout;

			ASQ()
			.then(function(done){
				done("Hello");
				done.fail("World");
			})
			.then(function(done,msg1){
				clearTimeout(timeout);

				if (msg1 === "Hello") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #14", timeout;

			ASQ()
			.then(function(done){
				done.fail("Hello");
				done("World");
			})
			.then(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg1){
				clearTimeout(timeout);

				if (msg1 === "Hello") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #15", timeout;

			function doSeq(msg1,msg2) {
				var seq = ASQ();

				seq
				.then(asyncDelayFn(100))
				.then(function(done){
					done(msg2);
				});

				return seq;
			}

			function doSeq2() {
				var seq = ASQ();

				seq
				.then(asyncDelayFn(50))
				.then(function(done){
					done("Sweet");
				});

				return seq;
			}

			ASQ()
			.then(function(done){
				asyncDelayFn(100)(function(){
					done("Hello","World");
				});
			})
			.seq(doSeq)
			.val(function(msg){
				// did messages fail to flow through seq()?
				if (msg !== "World") {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}

				return "Ignored message";
			})
			// NOTE: calling doSeq2() to pass in ASQ instance itself
			.seq(doSeq2())
			.then(function(done,msg){
				clearTimeout(timeout);

				if (msg === "Sweet") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #16", timeout;

			function doSeq(msg1,msg2) {
				var seq = ASQ();

				seq
				.then(asyncDelayFn(250))
				// NOTE: calling doSeq2() to pass in ASQ instance itself
				.seq(doSeq2(msg2));

				return seq;
			}

			function doSeq2(msg) {
				var seq = ASQ();

				seq
				.then(asyncDelayFn(50))
				// NOTE: calling doSeq3() to pass in ASQ instance itself
				.seq(doSeq3(msg + "!"));

				return seq;
			}

			function doSeq3(msg) {
				var seq = ASQ();

				seq
				.then(asyncDelayFn(100))
				.then(function(done){
					done.fail(msg.toUpperCase());
				});

				return seq;
			}

			ASQ()
			.then(function(done){
				asyncDelayFn(100)(function(){
					done("Hello","World");
				});
			})
			.seq(doSeq)
			.then(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			})
			.or(function(msg){
				clearTimeout(timeout);

				if (msg === "WORLD!") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #17", timeout;

			ASQ()
			.then(asyncDelayFn(100))
			.then(function(done){
				asyncDelayFn(100)(function(){
					done("Hello","World");
				});
			})
			.val(function(msg1,msg2){
				return msg1.toUpperCase() + " " + msg2.toUpperCase();
			})
			.then(function(_,msg1){
				clearTimeout(timeout);

				if (msg1 === "HELLO WORLD") {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #18", timeout;

			ASQ()
			.val(function(){
				return ASQ.messages("Hello","World");
			})
			.then(function(_,msg1,msg2){
				clearTimeout(timeout);

				if (msg1 === "Hello" &&
					msg2 === "World"
				) {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #19", timeout;

			ASQ(
				"Hello",
				"World",
				function(done,msg1,msg2){
					if (
						arguments.length === 3 &&
						msg1 === "Hello" &&
						msg2 === "World"
					) {
						done("So far so good");
					}
					else {
						var args = ARRAY_SLICE.call(arguments);
						args.unshift(testDone,label);
						FAIL.apply(FAIL,args);
					}
				},
				ASQ.messages("Yay","Nay"),
				function(done,msg1,msg2) {
					if (
						arguments.length === 3 &&
						msg1 === "Yay" &&
						msg2 === "Nay"
					) {
						done("Keep up the good work!");
					}
					else {
						var args = ARRAY_SLICE.call(arguments);
						args.unshift(testDone,label);
						FAIL.apply(FAIL,args);
					}
				},
				"Oh yeah"
			)
			.val(
				function(msg){
					if (!(
						arguments.length === 1 &&
						msg === "Oh yeah"
					)) {
						var args = ARRAY_SLICE.call(arguments);
						args.unshift(testDone,label);
						FAIL.apply(FAIL,args);
					}
				},
				"Ignored",
				"Also Ignored",
				ASQ.messages("Cool","Bro"),
				function(msg1,msg2){
					if (!(
						arguments.length === 2 &&
						msg1 === "Cool" &&
						msg2 === "Bro"
					)) {
						var args = ARRAY_SLICE.call(arguments);
						args.unshift(testDone,label);
						FAIL.apply(FAIL,args);
					}
				}
			)
			.val(
				"Nice",
				"Job",
				function(msg1,msg2){
					clearTimeout(timeout);

					if (arguments.length === 2 &&
						msg1 === "Nice" &&
						msg2 === "Job"
					) {
						PASS(testDone,label);
					}
					else {
						var args = ARRAY_SLICE.call(arguments);
						args.unshift(testDone,label);
						FAIL.apply(FAIL,args);
					}
				}
			)
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});
		tests.push(function(testDone){
			var label = "Test #20", timeout;

			// testing a custom plugin which will pass along
			// any messages received to it, but will inject
			// the message "foo" at the beginning, and append
			// the message "bar" after the last
			ASQ.extend("foobar",function(api,internals){
				return function __foobar__() {
					api.then(function(done){
						// cheat and manually inject a message into
						// the stream
						internals("sequence_messages").push("foo");

						// pass messages the proper way
						done.apply(null,
							Array.prototype.slice.call(arguments,1)
							.concat(["bar"])
						);
					});
					return api;
				};
			});

			ASQ("Hello","World")
			.foobar() // a custom plugin
			.val(function(msg1,msg2,msg3,msg4){
				clearTimeout(timeout);

				if (
					arguments.length === 4 &&
					msg1 === "foo" &&
					msg2 === "Hello" &&
					msg3 === "World" &&
					msg4 === "bar"
				) {
					PASS(testDone,label);
				}
				else {
					var args = ARRAY_SLICE.call(arguments);
					args.unshift(testDone,label);
					FAIL.apply(FAIL,args);
				}
			})
			.or(function(){
				clearTimeout(timeout);
				var args = ARRAY_SLICE.call(arguments);
				args.unshift(testDone,label);
				FAIL.apply(FAIL,args);
			});

			timeout = setTimeout(function(){
				FAIL(testDone,label + "(from timeout)");
			},1000);
		});

		return tests;
	}

	return defineTests;
});
