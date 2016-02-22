HCalendarPulldown = HMiniMenu.extend
  componentName: 'calendar_pulldown'
  defaultEvents:
    click: true
    resize: true
    preserveTime: true
  controlDefaults: HMiniMenu.prototype.controlDefaults.extend
    calendarHorizontalAlign: 'right'
    calendarVerticalAlign: 'top'
    label: ''
  calendarRect: ->
    [ x, y ] = [ @pageX(), @pageY() ]
    if @options.calendarHorizontalAlign == 'right'
      x = x - 200 + @rect.width
    else
      x = x + @rect.width
    if @options.calendarVerticalAlign == 'bottom'
      y = y - 200
    else
      y = y
    return [ x, y, 200, 200 ]
  repositionMenuItems: ->
    @menuItemView.setRect( @calendarRect() )
    @menuItemView.drawRect()
  menuShow: ->
    @base()
    @setLabel( @options.labelHide )
  menuHide: ->
    @base()
    @setLabel( @options.labelShow )
  setValueObj: (_valueObj)->
    @base(_valueObj)
    if @calendar?
      @calendar.valueObj.release( @calendar )
      @valueObj.bind(@calendar)

  refreshValue: ->
    _date = moment(@value * 1000).utc()
    @_timePreserve = [ _date.hours(), _date.minutes(), _date.seconds() ] if @options.preserveTime
    @calendar.setValue(@value)

  setValue: ( _value )->
    _date = moment(_value*1000).utc()
    if @options.preserveTime and @_timePreserve?
      [ _hours, _minutes, _seconds ] = @_timePreserve
      _date.hours( _hours )
      _date.minutes( _minutes )
      _date.seconds( _seconds )
    @base( _date.unix() )

  drawSubviews: ->
    @menuItemView = HView.new( @calendarRect(), @app,
      visible: false
      logicParent: @
      style:
        overflow: 'visible'
    )
    HControl.extend(
      defaultEvents:
        click: true
      click: ->
        @parent.options.logicParent.menuHide()
        true
    ).new( [ 0, 0, 200, 20 ], @menuItemView )
    @calendar = HCalendar.extend(
      refreshValue: ->
        @base()
        @parent.options.logicParent.setValue(@value)
    ).new( [ 0, 20, 200, 180 ], @menuItemView,
      value: @value
      valueObj: @valueObj
      preserveTime: @options.preserveTime
      todayStart: @options.todayStart
      style:
        boxShadow: '0 0 5px #333'
        borderRadius: '5px'
    )
HCalendarPullDown = HCalendarPulldown
HCalendarMenu = HCalendarPulldown
HCalenderButton = HCalendarPulldown
