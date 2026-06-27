window.ECOS_MOCK_DATA = {
  schemaVersion: 6,
  skills: [
    { id: "python", category: "Programming", name: "Python for Engineering", description: "Use Python for calculations, plotting, data logging, and automation.", prerequisites: [], status: "not started", difficulty: 2, relatedProjects: ["Temperature Monitor", "PID Motor Controller"] },
    { id: "c", category: "Programming", name: "C Programming", description: "Understand memory, pointers, structs, and embedded-style code.", prerequisites: ["Python basics"], status: "not started", difficulty: 3, relatedProjects: ["Button-controlled LED", "ESP32 Sensor Node"] },
    { id: "cpp", category: "Programming", name: "Arduino C++", description: "Write structured firmware with functions, classes, and state machines.", prerequisites: ["C Programming"], status: "not started", difficulty: 3, relatedProjects: ["Servo Controller"] },
    { id: "ohms-law", category: "Electronics", name: "Ohm's Law and Power", description: "Calculate voltage, current, resistance, and power dissipation.", prerequisites: [], status: "not started", difficulty: 1, relatedProjects: ["Blinking LED"] },
    { id: "rc", category: "Electronics", name: "RC Circuits and Filters", description: "Use capacitors for timing, filtering, and sensor smoothing.", prerequisites: ["Ohm's Law and Power"], status: "not started", difficulty: 2, relatedProjects: ["Temperature Monitor"] },
    { id: "mosfet", category: "Electronics", name: "MOSFET Switching", description: "Safely switch motors and loads from microcontroller pins.", prerequisites: ["Ohm's Law and Power"], status: "not started", difficulty: 3, relatedProjects: ["Servo Controller", "Drone Motor Test Stand"] },
    { id: "arduino-io", category: "Arduino", name: "GPIO, ADC, PWM", description: "Read inputs, analog values, and control outputs with PWM.", prerequisites: ["Ohm's Law and Power"], status: "not started", difficulty: 2, relatedProjects: ["Potentiometer LED Dimmer"] },
    { id: "fsm", category: "Arduino", name: "Finite State Machines", description: "Create predictable non-blocking firmware behavior.", prerequisites: ["GPIO, ADC, PWM"], status: "not started", difficulty: 3, relatedProjects: ["Line-following Robot"] },
    { id: "i2c", category: "Embedded Systems", name: "I2C / SPI / UART", description: "Communicate with sensors, displays, and modules.", prerequisites: ["Arduino C++"], status: "not started", difficulty: 3, relatedProjects: ["Temperature Monitor", "ESP32 Sensor Node"] },
    { id: "esp32", category: "Embedded Systems", name: "ESP32 and PlatformIO", description: "Build connected embedded projects with a more professional workflow.", prerequisites: ["Arduino C++", "I2C / SPI / UART"], status: "not started", difficulty: 4, relatedProjects: ["ESP32 Sensor Node"] },
    { id: "pid", category: "Control Systems", name: "PID Control", description: "Use feedback to control speed, position, or balance.", prerequisites: ["Finite State Machines", "Python for Engineering"], status: "not started", difficulty: 4, relatedProjects: ["PID Motor Controller", "IMU Balancing Platform"] },
    { id: "sensors", category: "Robotics", name: "Sensors and Actuators", description: "Combine measured inputs with controlled physical outputs.", prerequisites: ["GPIO, ADC, PWM"], status: "not started", difficulty: 3, relatedProjects: ["Ultrasonic Distance Sensor", "Line-following Robot"] },
    { id: "cad", category: "CAD / Mechanical Design", name: "Fusion 360 Basics", description: "Design mounts, enclosures, chassis, and assemblies.", prerequisites: [], status: "not started", difficulty: 2, relatedProjects: ["Line-following Robot", "Drone Motor Test Stand"] },
    { id: "printing", category: "Manufacturing / 3D Printing", name: "3D Printing for Prototypes", description: "Design parts with tolerances, fasteners, and assembly in mind.", prerequisites: ["Fusion 360 Basics"], status: "not started", difficulty: 3, relatedProjects: ["IMU Balancing Platform"] },
    { id: "resume", category: "Career Preparation", name: "Project Resume Writing", description: "Turn engineering projects into concise, evidence-based resume bullets.", prerequisites: [], status: "not started", difficulty: 2, relatedProjects: ["All portfolio projects"] }
  ],
  projects: [
    { id: "blink", title: "Blinking LED", status: "planned", difficulty: 1, skillsUsed: ["Ohm's Law and Power", "GPIO, ADC, PWM"], parts: "Arduino, LED, resistor, breadboard", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Built", technicalTask: "a microcontroller LED output circuit", toolsUsed: "Arduino, resistor, breadboard", measurableResult: "verified GPIO control and safe LED current limiting", concept: "digital output and current limiting" },
    { id: "button-led", title: "Button-controlled LED", status: "planned", difficulty: 1, skillsUsed: ["GPIO, ADC, PWM"], parts: "Arduino, button, LED, resistors", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Implemented", technicalTask: "a button-controlled LED input/output system", toolsUsed: "Arduino C++, breadboard", measurableResult: "created responsive digital input behavior", concept: "digital input, pull-up resistors, debouncing" },
    { id: "pot-dimmer", title: "Potentiometer LED Dimmer", status: "planned", difficulty: 2, skillsUsed: ["GPIO, ADC, PWM"], parts: "Arduino, potentiometer, LED, resistor", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Developed", technicalTask: "an analog input to PWM output dimmer", toolsUsed: "Arduino, ADC, PWM", measurableResult: "mapped sensor readings to output brightness", concept: "ADC resolution and PWM duty cycle" },
    { id: "temp", title: "Temperature Monitor", status: "planned", difficulty: 2, skillsUsed: ["Python for Engineering", "I2C / SPI / UART"], parts: "Arduino or ESP32, temperature sensor", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Created", technicalTask: "a temperature monitoring and logging system", toolsUsed: "Arduino, Python, serial data logging", measurableResult: "plotted measured temperature data over time", concept: "sensor calibration and data acquisition" },
    { id: "servo", title: "Servo Controller", status: "planned", difficulty: 2, skillsUsed: ["GPIO, ADC, PWM", "MOSFET Switching"], parts: "Arduino, servo, potentiometer or joystick", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Built", technicalTask: "a servo positioning controller", toolsUsed: "Arduino, PWM, potentiometer", measurableResult: "controlled actuator position from user input", concept: "PWM actuator control" },
    { id: "ultrasonic", title: "Ultrasonic Distance Sensor", status: "planned", difficulty: 2, skillsUsed: ["Sensors and Actuators"], parts: "Arduino, HC-SR04 or ToF sensor", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Integrated", technicalTask: "a distance sensing module", toolsUsed: "Arduino, ultrasonic sensor", measurableResult: "measured object distance and filtered readings", concept: "time-of-flight sensing" },
    { id: "line-robot", title: "Line-following Robot", status: "planned", difficulty: 4, skillsUsed: ["Sensors and Actuators", "Finite State Machines", "Fusion 360 Basics"], parts: "Chassis, motors, motor driver, line sensors", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Designed", technicalTask: "a differential-drive line-following robot", toolsUsed: "Arduino, motor driver, reflectance sensors, CAD", measurableResult: "followed a track using sensor feedback", concept: "robotics integration and closed-loop behavior" },
    { id: "pid-motor", title: "PID Motor Controller", status: "planned", difficulty: 5, skillsUsed: ["PID Control", "Python for Engineering", "MOSFET Switching"], parts: "DC motor, encoder, motor driver, microcontroller", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Implemented", technicalTask: "a closed-loop DC motor speed controller", toolsUsed: "Arduino or ESP32, encoder, PWM, Python", measurableResult: "analyzed step response, overshoot, and steady-state error", concept: "PID feedback control" },
    { id: "imu-platform", title: "IMU Balancing Platform", status: "planned", difficulty: 5, skillsUsed: ["PID Control", "I2C / SPI / UART", "3D Printing for Prototypes"], parts: "IMU, motor/servo, printed structure", notes: "", github: "", portfolioReady: false, lessons: "", actionVerb: "Prototyped", technicalTask: "an IMU-based balancing platform", toolsUsed: "IMU, microcontroller, PID control, CAD", measurableResult: "estimated tilt and corrected platform motion", concept: "sensor fusion and feedback control" },
    { id: "drone-stand", title: "Drone Motor Test Stand", status: "planned", difficulty: 5, skillsUsed: ["MOSFET Switching", "PID Control", "Fusion 360 Basics"], parts: "Brushless motor, ESC, propeller guard, load cell optional", notes: "Safety-first project.", github: "", portfolioReady: false, lessons: "", actionVerb: "Designed", technicalTask: "a drone motor characterization test stand", toolsUsed: "ESC, microcontroller, CAD, sensors", measurableResult: "measured thrust response across control inputs", concept: "actuator characterization and safety-critical testing" }
  ],
  ideas: [],
  stepRoadmap: [
    {
      id: "foundations",
      number: "01",
      title: "Setup and First Arduino Wins",
      time: "1-2 weeks",
      tasks: [
        { id: "setup-workflow", title: "Set up your build workspace", summary: "Get the tools ready and create one place to save code, photos, notes, and project evidence.", tag: "Setup", how: ["Install Arduino IDE, VS Code, Git, and Python.", "Create a GitHub repository or local folder for starter-kit projects.", "Create folders for code, photos, notes, and demo videos.", "Make your first commit with a short README describing your goals."], evidence: ["Tool setup screenshot", "Project folder or repo link", "First README", "First commit"], resources: [["GitHub Get Started", "https://docs.github.com/en/get-started"], ["Arduino Getting Started", "https://docs.arduino.cc/learn/starting-guide/getting-started-arduino/"]] },
        { id: "blink-build", title: "Blink an LED and document it like a project", summary: "Start with the classic first embedded project, but treat it as your first documentation rep.", tag: "Arduino", how: ["Wire one LED with a current-limiting resistor or use the board LED.", "Upload Blink and change the timing.", "Write what the resistor does and what the pin is controlling.", "Take one photo and save the sketch."], evidence: ["Arduino sketch", "Photo or screenshot", "Short note explaining current limiting", "README entry"], resources: [["Arduino Built-in Examples", "https://docs.arduino.cc/built-in-examples/"], ["Blink", "https://docs.arduino.cc/built-in-examples/basics/Blink/"]] },
        { id: "button-led", title: "Build a button-controlled LED", summary: "Learn digital input, digital output, pull-up/pull-down behavior, and basic interaction.", tag: "Arduino", how: ["Wire a pushbutton and LED.", "Read the button state and control the LED.", "Try INPUT_PULLUP and document what changes.", "Add a short demo video."], evidence: ["Wiring photo", "Sketch", "Demo video", "Note on pull-up or pull-down behavior"], resources: [["Button Example", "https://docs.arduino.cc/built-in-examples/digital/Button/"], ["Digital Read Serial", "https://docs.arduino.cc/built-in-examples/basics/DigitalReadSerial/"]] }
      ]
    },
    {
      id: "starter-kit-inputs",
      number: "02",
      title: "Inputs, Analog Signals, and Serial Data",
      time: "2-4 weeks",
      tasks: [
        { id: "pot-dimmer", title: "Potentiometer LED dimmer", summary: "Use analog input and PWM output in one small, satisfying build.", tag: "Arduino", how: ["Wire a potentiometer to an analog input.", "Read the value with analogRead.", "Map the value to PWM brightness with analogWrite.", "Print raw and mapped values to Serial Monitor."], evidence: ["Sketch", "Wiring photo", "Serial screenshot", "Short explanation of ADC and PWM"], resources: [["Analog Input", "https://docs.arduino.cc/built-in-examples/analog/AnalogInput/"], ["Fading", "https://docs.arduino.cc/built-in-examples/basics/Fade/"]] },
        { id: "debounce-counter", title: "Button counter with debounce", summary: "Make button input reliable and learn why real hardware is noisy.", tag: "Arduino", how: ["Start from your button LED circuit.", "Count button presses and print the count over Serial.", "Add debounce logic.", "Compare behavior before and after debounce."], evidence: ["Sketch", "Serial output", "Short before/after note", "Demo video"], resources: [["Debounce", "https://docs.arduino.cc/built-in-examples/digital/Debounce/"], ["State Change Detection", "https://docs.arduino.cc/built-in-examples/digital/StateChangeDetection/"]] },
        { id: "serial-sensor-log", title: "Serial sensor logger", summary: "Turn any starter-kit sensor into data you can save, graph, and discuss.", tag: "Data", how: ["Pick a photoresistor, thermistor, potentiometer, or any analog sensor from your kit.", "Print timestamped CSV-style readings over Serial.", "Save a short run of data.", "Make one simple plot in Python or a spreadsheet."], evidence: ["CSV sample", "Plot", "Sensor photo", "Notes on what changed during the test"], resources: [["Analog Read Serial", "https://docs.arduino.cc/built-in-examples/basics/AnalogReadSerial/"], ["Smoothing", "https://docs.arduino.cc/built-in-examples/analog/Smoothing/"]] }
      ]
    },
    {
      id: "starter-kit-outputs",
      number: "03",
      title: "Outputs, Motion, and Small Devices",
      time: "3-5 weeks",
      tasks: [
        { id: "tone-instrument", title: "Mini tone instrument", summary: "Use a buzzer or speaker to make feedback you can hear.", tag: "Output", how: ["Wire a piezo buzzer or speaker.", "Use tone() to play pitches.", "Control pitch with a potentiometer or buttons.", "Document how frequency changes what you hear."], evidence: ["Sketch", "Photo", "Short demo video", "Notes on frequency"], resources: [["Tone Keyboard", "https://docs.arduino.cc/built-in-examples/digital/toneKeyboard/"], ["Pitch Follower", "https://docs.arduino.cc/built-in-examples/digital/tonePitchFollower/"]] },
        { id: "servo-controller", title: "Servo position controller", summary: "Control physical motion with a potentiometer, button, or simple serial commands.", tag: "Motion", how: ["Connect a servo with proper power and ground.", "Use a potentiometer or buttons to command position.", "Add serial prints showing commanded angle.", "Record a demo showing smooth motion."], evidence: ["Sketch", "Wiring/power note", "Demo video", "Notes on servo limits"], resources: [["Servo Library", "https://docs.arduino.cc/libraries/servo/"]] },
        { id: "led-bargraph", title: "LED level meter", summary: "Make sensor data visible using several LEDs as a simple dashboard.", tag: "Display", how: ["Wire 5-10 LEDs or use an LED bar graph.", "Read an analog value.", "Light more LEDs as the value increases.", "Write a short note on thresholds and arrays."], evidence: ["Sketch", "Wiring photo", "Demo video", "Threshold notes"], resources: [["LED Bar Graph", "https://docs.arduino.cc/built-in-examples/display/BarGraph/"], ["Arrays", "https://docs.arduino.cc/built-in-examples/control-structures/Arrays/"]] }
      ]
    },
    {
      id: "systems",
      number: "04",
      title: "Starter Kit Systems",
      time: "4-8 weeks",
      tasks: [
        { id: "distance-alarm", title: "Ultrasonic distance alarm", summary: "Combine a sensor, thresholds, LEDs, and sound into a useful mini-system.", tag: "Sensor", how: ["Connect an ultrasonic distance sensor if your kit includes one.", "Print distance readings over Serial.", "Trigger LEDs or a buzzer at distance thresholds.", "Document accuracy limits and false readings."], evidence: ["Sketch", "Wiring photo", "Distance test table", "Demo video"], resources: [["Ping Ultrasonic Range Finder", "https://docs.arduino.cc/built-in-examples/sensors/Ping/"], ["Arduino Project Hub", "https://projecthub.arduino.cc/"]] },
        { id: "mini-environment-monitor", title: "Mini environment monitor", summary: "Build a small dashboard around temperature, light, or another sensor in your kit.", tag: "System", how: ["Pick one or two available sensors.", "Display status using Serial Monitor, LEDs, or a small display if you have one.", "Log readings for at least five minutes.", "Write a short interpretation of the data."], evidence: ["Sketch", "CSV or serial output", "Plot or table", "Build photo"], resources: [["Arduino Built-in Examples", "https://docs.arduino.cc/built-in-examples/"], ["Arduino Project Hub", "https://projecthub.arduino.cc/"]] },
        { id: "nonblocking-controller", title: "Non-blocking controller", summary: "Upgrade one previous project so it handles input, output, timing, and serial without delay().", tag: "Firmware", how: ["Choose your dimmer, alarm, or servo project.", "Replace delay() with millis().", "Write named states for behavior.", "Explain why the project is more responsive."], evidence: ["Before/after code", "State diagram", "Demo video", "Responsiveness notes"], resources: [["Blink Without Delay", "https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/"], ["Switch Case", "https://docs.arduino.cc/built-in-examples/control-structures/SwitchCase/"]] }
      ]
    },
    {
      id: "portfolio-builds",
      number: "05",
      title: "Portfolio-Level Builds",
      time: "Ongoing",
      tasks: [
        { id: "esp32-node", title: "Build an ESP32 wireless sensor node", summary: "Create a connected embedded project with sensor data and network output.", tag: "ESP32", how: ["Install PlatformIO.", "Read one I2C sensor.", "Publish readings through HTTP or MQTT.", "Run for one hour and document reliability."], evidence: ["Firmware", "Network screenshot", "Run log"], resources: [["PlatformIO Docs", "https://docs.platformio.org/"], ["ESP-IDF Docs", "https://docs.espressif.com/projects/esp-idf/"]] },
        { id: "pid-controller", title: "Implement PID speed control", summary: "Build a flagship controls project with measured performance.", tag: "PID", how: ["Start with proportional control.", "Add integral and derivative terms after baseline behavior is clear.", "Tune for rise time, overshoot, settling time, and steady-state error.", "Write a report showing controller versions."], evidence: ["PID code", "Step response plots", "Tuning table", "Demo video"], resources: [["Brian Douglas Controls", "https://www.youtube.com/@BrianBDouglas"]] },
        { id: "portfolio-site", title: "Create your portfolio and resume proof", summary: "Turn completed work into a public engineering profile.", tag: "Career", how: ["Pick three projects.", "Add photos, videos, diagrams, and measured results.", "Write resume bullets.", "Create a simple portfolio website."], evidence: ["Portfolio URL", "Resume PDF", "Pinned GitHub repos"], resources: [["GitHub Pages", "https://pages.github.com/"]] }
      ]
    }
  ],
  repos: [],
  portfolioChecklist: [
    { id: "problem", item: "Clear problem statement", done: false },
    { id: "photos", item: "Build photos added", done: false },
    { id: "video", item: "Demo video recorded", done: false },
    { id: "diagram", item: "Block diagram, schematic, or wiring diagram included", done: false },
    { id: "results", item: "Measured results, plots, or test data included", done: false },
    { id: "lessons", item: "Lessons learned and next revision documented", done: false }
  ],
  projectDocs: {},
  journal: [],
  internship: [
    { id: "resume", item: "Resume", done: false, notes: "Create one-page project-focused resume." },
    { id: "linkedin", item: "LinkedIn", done: false, notes: "Add an engineering headline and project links." },
    { id: "github", item: "GitHub", done: false, notes: "Pin best repositories." },
    { id: "portfolio", item: "Portfolio website", done: false, notes: "Create simple website with top projects." },
    { id: "projects", item: "Projects completed", done: false, notes: "At least 3 documented projects." },
    { id: "interview", item: "Interview practice", done: false, notes: "Practice 60-second and 5-minute project explanations." },
    { id: "leetcode", item: "LeetCode / coding practice", done: false, notes: "Light practice for programming screens." },
    { id: "technical", item: "Technical explanations", done: false, notes: "Circuits, embedded, controls, and debugging stories." },
    { id: "networking", item: "Networking", done: false, notes: "Professors, labs, clubs, alumni, makerspaces." },
    { id: "applications", item: "Applications submitted", done: false, notes: "Track internship applications and follow-ups." }
  ]
};
