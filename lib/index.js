/**
 * Module dependencies
 */
var plist = require('plist')
  , utils = require('./utils')
/*!
 * modules exports
 */
module.exports = Plist

/**
 * Constructor
 */
function Plist(opts) {
  this.obj = opts || {};
}

/**
 * Adds a boolean to the plist object for the given `k`
 *
 * Example
 *
 *    plist.addBoolean('Disabled', true)
 *
 * @param {String} k The key
 * @param {Boolean} v The value 
 * @api public
 */
Plist.prototype.addBoolean = function(k, v) {
  if (typeof v !== 'boolean') throw new Error(k+' must be a boolean')
  this.obj[k] = v
  return this
}

/**
 * Adds a string to the plist object for the given `k`
 *
 * If `mand` is not an array, then no restrictions are placed
 *
 * Example
 *
 *    plist.addString('Label', 'com.curapps.test')
 *
 * @param {String} k The key
 * @param {String} v The value
 * @param {Array} mand An array of values which must include the value (optional)
 * @api public
 */
Plist.prototype.addString = function(k, v, mand) {
  if (typeof v === 'number') v = String(v)
  if (typeof v !== 'string') throw new Error(k+' must be a string')
  if (mand && Array.isArray(mand)) {
    if (mand.indexOf(v) === -1) {
      throw new Error(k+' must be one of '+mand.join(', '))
    }
  }
  this.obj[k] = v
  return this
}

/**
 * Adds an array to the plist object for the given `k`
 *
 * NOTE: **Any value that is not an array will be wrapped in an array**
 *
 * Example
 *
 *    plist.addArray('ProgramArguments', ['/usr/local/bin/node', 'test.js'])
 *
 * @param {String} k The key
 * @param {Array|String|Number|Object} v The value
 * @api public
 */
Plist.prototype.addArray = function(k, v) {
  if (Array.isArray(v)) {
    this.obj[k] = v
  } else {
    if (!v || v === "") {
      this.obj[k] = []
    } else {
      this.obj[k] = [v]
    }
  }
  return this
}

/**
 * Adds a number to the plist object for the given `k`
 *
 * Example
 *
 *    plist.addNumber('TimeOut', 30)
 *
 * @param {String} k The key
 * @param {Number} v The value
 * @api public
 */
Plist.prototype.addNumber = function(k, v) {
  if (typeof v !== 'number') {
    v = Number(v)
  }
  if (isNaN(v)) throw new Error(k+' must be a valid number')
  this.obj[k] = v
  return this
}

/**
 * Adds an object to the plist object for the given `k`
 *
 * Example
 *
 *    var obj = { DEBUG: 'Plist*' };
 *    plist.addObject('EnvironmentVariables', obj)
 *
 * @param {String} k The key
 * @param {Object} v The value
 * @api public
 */
Plist.prototype.addObject = function(k, v) {
  if (Array.isArray(v)) throw new Error(k+' must be an object')
  if (typeof v !== 'object') throw new Error(k+' must be an object')
  this.obj[k] = v
  return this
}


/**
 * ### launchctl specific helper functions
 */

/**
 * #### Boolean functions
 */

/**
 * Sets the `Disabled` bool
 *
 * Example
 *
 *    plist.setDisabled(true)
 *
 * @param {Boolean} disabled Is the job disabled?
 * @api public
 */
Plist.prototype.setDisabled = function(disabled) {
  return this.addBoolean('Disabled', disabled)
}

/**
 * Sets the `EnableGlobbing` bool
 *
 * Example
 *
 *    plist.setEnableGlobbing(false)
 *
 * @param {Boolean} globbing Should enable globbing?
 * @api public
 */
Plist.prototype.setEnableGlobbing = function(g) {
  return this.addBoolean('EnableGlobbing', g)
}

/**
 * Sets the `EnableTransactions` bool
 *
 * Example
 *
 *    plist.setEnableTransactions(true)
 *
 * @param {Boolean} transactions Should enable transactions?
 * @api public
 */
Plist.prototype.setEnableTransactions = function(t) {
  return this.addBoolean('EnableTransactions', t)
}

/**
 * Sets the `OnDemand` bool
 *
 * Example
 *
 *    plist.setOnDemand(false)
 *
 * @param {Boolean} ondemand Job should be launchd on demand
 * @api public
 */
Plist.prototype.setOnDemand = function(d) {
  return this.addBoolean('OnDemand', d)
}

/**
 * Sets the `RunAtLoad` bool
 *
 * Example
 *
 *    plist.setRunAtLoad(true)
 *
 * @param {Boolean} runatload Should this job run at session load (differs based on session)
 * @api public
 */
Plist.prototype.setRunAtLoad = function(r) {
  return this.addBoolean('RunAtLoad', r)
}

/**
 * Sets the `InitGroups` bool
 *
 * Example
 *
 *    plist.setInitGroups(false)
 *
 * @param {Boolean} groups
 * @api public
 */
Plist.prototype.setInitGroups = function(g) {
  return this.addBoolean('InitGroups', g)
}

/**
 * Sets the `inetdCompatibility.Wait` bool
 *
 * Example
 *
 *    plist.setInetdCompatibilityWait(false)
 *
 * @param {Boolean} wait Should wait?
 * @api public
 */
Plist.prototype.setInetdCompatibilityWait = function(w) {
  if (typeof w !== 'boolean') throw new Error('The wait flag must be a boolean')
  this.obj['inetdCompatibility'] = { 'Wait': w };
  return this
}

/**
 * Sets the `StartOnMount` bool
 *
 * Example
 *
 *    plist.setStartOnMount(true)
 *
 * @param {Boolean} s Should it start on mount?
 * @api public
 */
Plist.prototype.setStartOnMount = function(s) {
  return this.addBoolean('StartOnMount', s)
}

/** 
 * Sets the `Debug` bool
 *
 * Example
 *
 *    plist.setDebug(false)
 *
 * @param {Boolean} d Adjust log mask to LOG_DEBUG
 * @api public
 */
Plist.prototype.setDebug = function(d) {
  return this.addBoolean('Debug', d)
}

/**
 * Sets the `WaitForDebugger` bool
 *
 * Example
 *
 *    plist.setWaitForDebugger(false)
 *
 * @param {Boolean} d Should this job wait for a debugger to attach?
 * @api public
 */
Plist.prototype.setWaitForDebugger = function(d) {
  return this.addBoolean('WaitForDebugger', d)
}

/**
 * Sets the `AbandonProcessGroup` bool
 *
 * Example
 *
 *    plist.setAbandonProcessGroup(false)
 *
 * @param {Boolean} d Should we disable default behavior of killing processes with same GID when a job dies?
 * @api public
 */
Plist.prototype.setAbandonProcessGroup = function(d) {
  return this.addBoolean('AbandonProcessGroup', d)
}

/**
 * Sets the `LowPriorityIO` bool
 *
 * Example
 *
 *    plist.setLowPriorityIO(false)
 *
 * @param {Boolean} d Is this a low priority during I/O?
 * @api public
 */
Plist.prototype.setLowPriorityIO = function(d) {
  return this.addBoolean('LowPriorityIO', d)
}

/**
 * Sets the `LaunchOnlyOnce` bool
 * 
 * Example
 *
 *    plist.setLaunchOnlyOnce(true)
 *
 * @param {Boolean} d Can this job be run once and only once?
 * @api public
 */
Plist.prototype.setLaunchOnlyOnce = function(d) {
  return this.addBoolean('LaunchOnlyOnce', d)
}

// =====================
// End boolean functions
// =====================

/**
 * #### String functions
 */

/**
 * Sets the `Label` field
 *
 * Example
 *
 *    plist.setLabel('com.curapps.test')
 *
 * @param {String} label The job label
 * @api public
 */
Plist.prototype.setLabel = function(label) {
  return this.addString('Label', label)
}

/**
 * Sets the `Program` string
 *
 * Example
 *
 *    plist.setProgram('/usr/local/bin/node')
 *
 * @param {String} program The executable
 * @api public
 */
Plist.prototype.setProgram = function(program) {
  return this.addString('Program', program)
}

/**
 * Sets the `UserName` string
 *
 * Example
 *
 *    plist.setUserName('evan')
 *
 * @param {String} username The username
 * @api public
 */
Plist.prototype.setUserName = function(u) {
  return this.addString('UserName', u)
}

/**
 * Sets the `GroupName` string
 *
 * Example
 *
 *    plist.setGroupName('admin')
 *
 * @param {String} groupname The group name
 * @api public
 */
Plist.prototype.setGroupName = function(g) {
  return this.addString('GroupName', g)
}

/**
 * Sets the `LimitLoadToSessionType` string 
 *
 * Example
 *
 *    plist.setLimitLoadToSessionType('Aqua')
 *
 * @param {String} sessiontype The session type
 * @api public
 */
Plist.prototype.setLimitLoadToSessionType = function(s) {
  return this.addString('LimitLoadToSessionType', s, ['Aqua', 'LoginWindow', 'Background', 'StandardIO', 'System'])
}

/**
 * Sets the `StandardErrorPath` string
 *
 * Example
 *
 *    plist.setStdErrPath('/Users/evan/Desktop/err.log')
 *
 * @param {String} p The path to which stderr will be written
 * @api public
 */
Plist.prototype.setStdErrPath = function(s) {
  return this.addString('StandardErrorPath', s)
}

/**
 * Sets the `StandardOutPath` string
 *
 * Example
 *
 *    plist.setStdOutPath('/Users/evan/Desktop/out.log')
 *
 * @param {String} p The path to which stdout will be written
 * @api public
 */
Plist.prototype.setStdOutPath = function(s) {
  return this.addString('StandardOutPath', s)
}

/**
 * Sets the `StandardInPath` string
 *
 * Example
 *
 *    plist.setStdInPath('/Users/evan/Desktop/in')
 *
 * @param {String} s The path from which stdin will be read
 * @api public
 */
Plist.prototype.setStdInPath = function(s) {
  return this.addString('StandardInPath', s)
}

/**
 * Sets the `RootDirectory` string
 *
 * Example
 *
 *    plist.setRootDir('/Users/evan/Desktop/test')
 *
 * @param {String} dir The root directory from which to run this job
 * @api public
 */
Plist.prototype.setRootDir = function(d) {
  return this.addString('RootDirectory', d)
}

/**
 * Sets the `WorkingDirectory` string
 *
 * Example
 *
 *    plist.setWorkingDir('/Users/evan/Desktop/test')
 *
 * @param {String} dir The working directory from which to run this job
 * @api public
 */
Plist.prototype.setWorkingDir = function(d) {
  return this.addString('WorkingDirectory', d)
}

/**
 * Sets the `ProcessType` string
 *
 * Example
 *
 *    plist.setProcessType('Background')
 *
 * @param {String} s The process type. One of `Background`, `Standard`, `Adaptive`, or `Interactive`
 * @api public
 */
Plist.prototype.setProcessType = function(s) {
  return this.addString('ProcessType', s, ['Background', 'Standard', 'Adaptive', 'Interactive'])
}

// ====================
// End string functions
// ====================

/**
 * #### Number functions
 */

/**
 * Sets the `Umask` number
 *
 * Example
 *
 *    plist.setUmask(501)
 *
 * @param {Number} umask The umask
 * @api public
 */
Plist.prototype.setUmask = function(u) {
  return this.addNumber('Umask', u)
}

/**
 * Sets the `TimeOut` number
 *
 * Example
 *
 *    plist.setTimeOut(30)
 *
 * @param {Number} to The duration after which launchd will time out
 * @api public
 */
Plist.prototype.setTimeOut = function(t) {
  return this.addNumber('TimeOut', t)
}

/**
 * Sets the `ExitTimeOut` number
 *
 * Example
 *
 *    plist.setExitTimeOut(30)
 *
 * @param {Number} to The duration after which launchd will exit the job
 * @api public
 */
Plist.prototype.setExitTimeOut = function(t) {
  return this.addNumber('ExitTimeOut', t)
}

/**
 * Sets the `ThrottleInterval` number
 *
 * Example
 *
 *    plist.setThrottleInterval(300)
 *
 * @param {Number} throttle The time between restarts
 * @api public
 */
Plist.prototype.setThrottleInterval = function(t) {
  return this.addNumber('ThrottleInterval', t)
}

/**
 * Sets the `StartInterval` number
 *
 * Example
 *
 *    plist.setStartInterval(30)
 *
 * @param {Number} i The start interval
 * @api public
 */
Plist.prototype.setStartInterval = function(i) {
  return this.addNumber('StartInterval', i)
}

/**
 * Sets the `Nice` number
 *
 * Example
 *
 *    plist.setNice(19)
 *
 * @param {Number} i The nice value to apply to the daemon
 * @api public
 */
Plist.prototype.setNice = function(i) {
  return this.addNumber('Nice', i)
}

// ====================
// End number functions
// ====================


/**
 * #### Array functions
 */

/**
 * Sets the `ProgramArguments` array
 *
 * Example
 *
 *    var args = [
 *        '/usr/local/bin/node'
 *      , '/Users/evan/Desktop/test/app.js'
 *    ]
 *    plist.setProgramArgs(args)
 *
 * @param {Array|String|Number|Object} args The program arguments
 * @api public
 */
Plist.prototype.setProgramArgs = function(args) {
  return this.addArray('ProgramArguments', args)
}

/**
 * Sets the `LimitLoadToHosts` array
 *
 * Example
 *
 *    var hosts = ['127.0.0.1']
 *    plist.setLimitLoadToHosts(hosts)
 *
 * @param {Array|String|Number} hosts The hosts to which launchd will limit
 * @api public
 */
Plist.prototype.setLimitLoadToHosts = function(h) {
  return this.addArray('LimitLoadToHosts', h)
}

/**
 * Sets the `LimitLoadFromHosts` array
 *
 * Example
 *
 *    var hosts = ['127.0.0.1']
 *    plist.setLimitLoadFromHosts(hosts)
 *
 * @param {Array|String|Number} hosts The hosts from which launchd will limit
 * @api public
 */
Plist.prototype.setLimitLoadFromHosts = function(h) {
  return this.addArray('LimitLoadFromHosts', h)
}

/**
 * Sets the `WatchPaths` array
 *
 * Example
 *
 *    var p = '/Users/evan/Desktop/test/apps'
 *    plist.setWatchPaths(p)
 *
 * @param {Array|String|Number|Object} p The paths to watch
 * @api public
 */
Plist.prototype.setWatchPaths = function(p) {
  return this.addArray('WatchPaths', p)
}

/**
 * Sets the `QueueDirectories` array
 *
 * Example
 *
 *    var dirs = ['/Users/evan/Desktop/test/apps']
 *    plist.setQueueDirectories(dirs)
 *
 * @param {Array|String|Number|Object} d The directories to watch
 * @api public
 */
Plist.prototype.setQueueDirectories = function(d) {
  return this.addArray('QueueDirectories', d)
}

// ===================
// End array functions
// ===================

/**
 * #### Object functions
 */

/**
 * Sets the `EnvironmentVariables` object
 *
 * Example
 *
 *    var env = { NODE_ENV: 'test' };
 *    plist.setEnvVar(env)
 *
 * @param {Object} obj The environment variables for the job
 * @api public
 */
Plist.prototype.setEnvVar = function(obj) {
  return this.addObject('EnvironmentVariables', obj)
}

/**
 * Sets the `SoftResourceLimits` object
 *
 * Example
 *
 *    var res = { 'NumberOfFiles': 10000 }
 *    plist.setSoftResourceLimits(res)
 *
 * @param {Object} obj A dictionary of integers
 * @api public
 */
Plist.prototype.setSoftResourceLimits = function(obj) {
  return this.addObject('SoftResourceLimit', obj)
}

/**
 * Sets the `HardResourceLimits` object
 *
 * Example
 *
 *    var res = { 'NumberOfFiles': 10000 }
 *    plist.setHardResourceLimits(res)
 *
 * @param {Object} obj A dictionary of integers
 * @api public
 */
Plist.prototype.setHardResourceLimits = function(obj) {
  return this.addObject('HardResourceLimits', obj)
}

// ====================
// End object functions
// ====================


/**
 * Sets the `KeepAlive` value
 *
 * Examples
 *
 *    plist.setKeepAlive(true)
 *
 *    var opts = { SuccessfulExit: false }
 *    plist.setKeepAlive(opts)
 *
 * @param {Boolean|String|Number|Object} keepalive The KeepAlive value
 * @api public
 */
Plist.prototype.setKeepAlive = function(k) {
  this.obj['KeepAlive'] = k
  return this
}

/**
 * Removes the `StartCalendarInterval` object/array
 *
 * Example
 *
 *    plist.deleteStartCalendarInterval()
 *
 * @api public
 */
Plist.prototype.deleteStartCalendarInterval = function() {
  if (this.obj.hasOwnProperty('StartCalendarInterval')) {
    delete this.obj['StartCalendarInterval']
  }
  return this
}

/**
 * Adds a Dictionary for the `StartCalendarInterval`
 *
 * Example
 *
 *    // Run at minute 1 of every hour
 *    var obj = { Minute: 1 }
 *    plist.addCalendarInterval(obj)
 *
 * @param {Object} o Must contain at least one of `Minute`, `Hour`, `Day`, `Weekday`, or `Month`
 * @api public
 */
Plist.prototype.addCalendarInterval = function(o) {
  // Keys can be
  // Minute, Hour, Day, Weekday, and Month
  // If a key is omitted, then it is considered a wildcard
  if ('object' !== typeof o) {
    throw new Error('Invalid calendar interval. Must be an object')
  }
  
  if (utils.emptyObject(o)) {
    throw new Error('StartCalendarInterval cannot be an empty object')
  }
  
  var cal = {};
  
  if (o.hasOwnProperty('Minute')) {
    var min = utils.getNumber(o.Minute)
    if (min === false) throw new Error('Minute key must be a number')
    cal.Minute = min
  }
  
  if (o.hasOwnProperty('Hour')) {
    var hour = utils.getNumber(o.Hour)
    if (hour === false) throw new Error('Hour key must be a number')
    cal.Hour = hour
  }
  
  if (o.hasOwnProperty('Day')) {
    var day = utils.getNumber(o.Day)
    if (day === false) throw new Error('Day key must be a number')
    cal.Day = day
  }
  
  if (o.hasOwnProperty('Weekday')) {
    var weekday = utils.getWeekday(o.Weekday)
    if (weekday === false) throw new Error('Weekday key must be a number or a string containing the day of the week')
    cal.Weekday = weekday
  }
  
  if (o.hasOwnProperty('Month')) {
    var month = utils.getNumber(o.Month)
    if (month === false) throw new Error('Month key must be a number')
    cal.Month = month
  }
  
  if (this.obj.hasOwnProperty('StartCalendarInterval')) {
    var c = this.obj.StartCalendarInterval
    if (Array.isArray(c)) {
      this.obj.StartCalendarInterval.push(cal)
    } else if ('object' === typeof c) {
      var keys = Object.keys(this.obj.StartCalendarInterval)
      if (keys && keys.length > 0) {
        this.obj.StartCalendarInterval = [this.obj.StartCalendarInterval]
        this.obj.StartCalendarInterval.push(cal)
      }
    } else {
      // Nothing there yet
      this.obj.StartCalendarInterval = cal
    }
  } else {
    this.obj.StartCalendarInterval = cal
  }
  return this
}


/**
 * Builds the actual plist object into a string
 *
 * Example
 *
 *    var contents = plist.build()
 *
 * @param {Object} obj The plist object
 * @api public
 */
Plist.prototype.build = function() {
  return plist.build(this.obj).toString()
}

/**
 * Wipes the slate clean
 *
 * Example
 *
 *    plist.reset()
 *
 * @api public
 */
Plist.prototype.reset = function() {
  this.obj = {};
  return this
}