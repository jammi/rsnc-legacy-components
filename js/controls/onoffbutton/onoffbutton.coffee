HOnOffButton = HCheckbox.extend
  componentName: 'onoffbutton'
  defaultEvents:
    click: true
  controlDefaults: HControlDefaults.extend
    label: 'ON'
    labelOff: 'OFF'
  customOptions: (_options)->
    if _options.label instanceof Array
      _options.labelOff = _options.label[1]
      _options.label = _options.label[0]
    @labelOff = _options.labelOff
  markupElemNames: [ 'label', 'offlabel', 'control', 'onvalue', 'offvalue' ]
  refreshLabel: ->
    @base()
    @refreshLabelOff()
  setLabel: (_arr)->
    if _arr instanceof Array
      _label = _arr[0]
      @setLabelOff( _arr[1] )
    else
      _label = _arr
    @setMarkupOfPart('label',_label)
  setLabelOff: (_label)->
    @offLabel = _label
    @refreshLabelOff()
  refreshLabelOff: ->
    @setMarkupOfPart( 'offlabel', @labelOff ) if @drawn
  refreshValue: ->
    if @value != false
      @setStyleOfPart( 'offvalue', 'display', 'none' )
    if @value != true
      @setStyleOfPart( 'onvalue', 'display', 'none' )
    if @value == false
      @setStyleOfPart( 'offvalue', 'display', 'block' )
    if @value == true
      @setStyleOfPart( 'onvalue', 'display', 'block' )
  click: (x,y)->
    hw = @rect.width*0.5
    x = x-@pageX()
    if x < hw
      @setValue(true)
    else
      @setValue(false)
