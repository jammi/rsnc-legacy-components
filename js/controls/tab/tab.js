
/*** = Description
  ** HTabView
  **
  **
  ***/
var//RSence.Controls
HTabView = HView.extend({
/** = Description
  * draw function
  *
  **/
  draw: function(){
    var _isDrawn = this.drawn;
    this.base();
    if(!_isDrawn){
      var i=0,_styles = [
        ['overflow','auto']
      ];
      for(i;i<_styles.length;i++){
        this.setStyle(_styles[i][0],_styles[i][1]);
      }
      this.hide();
    }
  }
});

/** = Description
  * HTab
  *
  **/
var//RSence.Controls
HTab = HControl.extend({
  componentName: "tab",
  refreshOnValueChange: true,
  refreshOnLabelChange: false,

  customOptions: function(_options){
    this.tabs = [];
    this.tabLabels = [];
    this.tabLabelBounds = [];
    this.tabLabelStrings = [];
  },

  rightmostPx: 0,
  selectIdx: -1,

  // overridden in the template
  tabLabelHeight: 20,

  // overridden in the template
  tabLabelLeftEdge: 4,

  // overridden in the template
  tabLabelRightEdge: 4,

  // overridden in the template
  fontStyle: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '13px'
  },

  tabLabelHTMLPrefix1: '<div class="edge_left"></div><div class="tablabel" style="width:',
  tabLabelHTMLPrefix2: 'px">',
  tabLabelHTMLSuffix: '</div><div class="edge_right"></div>',
  tabLabelParentElem: 'label',
  tabLabelElementTagName: 'div',
  tabLabelAlign: 'left',
  tabLabelFillBg: false,
  tabTriggerLink: false,
  tabLabelNoHTMLPrefix: false,

/** = Description
  * refreshValue function
  *
  **/
  refreshValue: function(){
    var _this = this;
    if(typeof _value === 'number'){
      this.pushTask( function(){
        var _index = parseInt(_this.value,10);
        if( _index < _this.tabs.length && _index !== _this.selectIdx){
          _this.selectTab(_index);
        }
      });
    }
  },

/** = Description
  * Sets label for the tab.
  *
  * = Parameters
  * +_label+::  Label for the tab
  *
  **/
  setLabel: function(_label){
    this.label = _label;
  },

/** = Description
  * selectTab function
  *
  * = Parameters
  * +_tabIdx+::
  *
  **/
  selectTab: function(_tabIdx){
    if(_tabIdx instanceof HTabView){
      _tabIdx = _tabIdx.tabIndex;
    }
    if(~this.selectIdx){
      var _tabSelectElemId = this.tabLabels[this.selectIdx],
          _tabSelectViewId = this.tabs[this.selectIdx];
      ELEM.delClassName(_tabSelectElemId,'item_fg');
      ELEM.addClassName(_tabSelectElemId,'item_bg');
      HSystem.views[_tabSelectViewId].hide();
    }
    if(~_tabIdx){
      var _tabLabelElemId = this.tabLabels[_tabIdx],
          _tabViewId = this.tabs[_tabIdx];
      ELEM.delClassName(_tabLabelElemId,'item_bg');
      ELEM.addClassName(_tabLabelElemId,'item_fg');
      HSystem.views[_tabViewId].show();
    }
    this.selectIdx = _tabIdx;
    this.setValue(_tabIdx);
  },

/** = Description
  * addTab function
  *
  * = Parameters
  * +_tabLabel+::
  * +_doSelect+::
  *
  **/
  addTab: function(_tabLabel,_doSelect,_viewClass,_viewClassOptions){
    var
    _this = this,
    _tabIdx = _this.tabs.length,
    _tabLabelHTML = '',
    _labelTextWidth = _this.stringWidth( _tabLabel, null, 0, _this.fontStyle ),
    _labelWidth = _labelTextWidth+_this.tabLabelLeftEdge+_this.tabLabelRightEdge,
    _tabLabelElemId = ELEM.make(_this.markupElemIds[_this.tabLabelParentElem],_this.tabLabelElementTagName),
    _tab;
    if( _viewClass === undefined ){
      _tab = HTabView.nu( [0,_this.tabLabelHeight,null,null,0,0], _this);
    }
    else {
      _tab = _viewClass.nu( [0,_this.tabLabelHeight,null,null,0,0], _this, _viewClassOptions );
    }
    _tabIdx = _this.tabs.length;
    if(_this.tabLabelNoHTMLPrefix){
      _tabLabelHTML = _tabLabel;
    }
    else {
      _tabLabelHTML = _this.tabLabelHTMLPrefix1+_labelTextWidth+_this.tabLabelHTMLPrefix2+_tabLabel+_this.tabLabelHTMLSuffix;
    }
    _tab.hide();
    ELEM.addClassName(_tabLabelElemId,'item_bg');
    ELEM.setStyle(_tabLabelElemId,'width',_labelWidth+'px');
    ELEM.setStyle(_tabLabelElemId,_this.tabLabelAlign,_this.rightmostPx+'px');
    ELEM.setHTML(_tabLabelElemId,_tabLabelHTML);
    _this.tabLabelStrings.push(_tabLabel);
    if(_this.tabTriggerLink && !_this.isProduction){
      console.log('HTab.options.tabTriggerLink is no longer supported')
    }
    _this.tabTriggerLink = false;
    _this.setClick(true);
    _this.tabLabelBounds.push([_this.rightmostPx,_this.rightmostPx+_labelWidth]);
    _this.rightmostPx+=_labelWidth;
    if(_this.tabLabelAlign === 'right'){
      ELEM.setStyle(_this.markupElemIds[_this.tabLabelParentElem],'width',_this.rightmostPx+'px');
    }
    else if (_this.tabLabelFillBg) {
      ELEM.setStyle(_this.markupElemIds.state,'left',_this.rightmostPx+'px');
    }
    _this.tabs.push(_tab.viewId);
    _this.tabLabels.push(_tabLabelElemId);
    _tab.tabIndex = _tabIdx;

    if(_doSelect || (_this.value === _tabIdx)){
      _this.selectTab(_tabIdx);
    }
    return _tab;
  },

/** = Description
  * click function
  *
  * = Parameters
  * +x+::
  * +y+::
  *
  **/
  click: function(x,y){
    if(this.tabTriggerLink){
      this.setClickable(false);
      return;
    }
    x -= this.pageX();
    y -= this.pageY();
    if(y<=this.tabLabelHeight){
      if (this.tabLabelAlign === 'right') {
        x = this.rect.width - x;
      }
      if(x<=this.rightmostPx){
        var i=0,_labelBounds;
        for(i;i<this.tabLabelBounds.length;i++){
          _labelBounds = this.tabLabelBounds[i];
          if(x<_labelBounds[1] && x>=_labelBounds[0]){
            this.selectTab(i);
            return;
          }
        }
      }

    }
  },

/** = Description
  * removeTab function
  *
  * = Parameters
  * +_tabIdx+::
  *
  **/
  removeTab: function(_tabIdx){
    var
    _selIdx = this.selectIdx,
    _tabViewId = this.tabs[_tabIdx],
    _tabLabelElemId = this.tabLabels[_tabIdx],
    _tabLabelWidth, i = 0;
    this.tabs.splice(_tabIdx,1);
    this.tabLabels.splice(_tabIdx,1);
    this.tabLabelBounds.splice(_tabIdx,1);
    this.tabLabelStrings.splice(_tabIdx,1);
    if(_tabIdx===_selIdx){
      this.selectIdx=-1;
      if(_tabIdx===0&&this.tabs.length===0){
        this.selectTab(-1);
      }
      else if(_tabIdx===(this.tabs.length-1)){
        this.selectTab(_tabIdx-1);
      }
      else{
        this.selectTab(_tabIdx);
      }
    }
    else if(_tabIdx<_selIdx){
      this.selectIdx--;
    }
    ELEM.del(_tabLabelElemId);
    HSystem.views[_tabViewId].die();

    //Reset labels positions
    this.rightmostPx = 0;
    for(; i < this.tabs.length; i++){
      _tabLabelElemId = this.tabLabels[i];
      _tabLabelWidth = ELEM.getIntStyle(_tabLabelElemId,'width');
      ELEM.setStyle(_tabLabelElemId,this.tabLabelAlign,this.rightmostPx+'px');
      this.rightmostPx += _tabLabelWidth;
    }
    if(this.tabLabelAlign === 'right'){
      ELEM.setStyle(this.markupElemIds[this.tabLabelParentElem],'width',this.rightmostPx+'px');
    }
    else if (this.tabLabelFillBg) {
      ELEM.setStyle(this.markupElemIds.state,'left',this.rightmostPx+'px');
    }
  }
});

/** = Description
  * HTabItem is a wrapper for creating tabs as subviews when using JSONRenderer.
  * rect is ignored
  * parent is the HTab instance
  * options may contain the following:
  * select: true|false, passed on to addTab
  * label: true|false, passed on to addTab
  *
  * = Returns
  * a new HTabView instance returned by addTab
  *
  **/
var//RSence.Controls
HTabItem = {
  nu: function(_rect, _parent, _options){
    if( _rect && _rect.hasAncestor && _rect.hasAncestor( HView ) ){
      _options = _parent;
      _parent = _rect;
    }
    else {
      console.warn( "Warning: the rect constructor argument of HTabItem is deprecated." );
    }
    return _parent.addTab( _options.label, _options.select );
  },
  'new': function(_rect, _parent, _options){
    return this.nu(_rect,_parent,_options);
  }
};

var//RSence.Controls
GUITreeTabView = HControl.extend({
  controlDefaults: HControlDefaults.extend({
    visible: false,
    autoCreate: false,
    autoDestroy: true
  }),
  jsonRenderer: false,
  createJSONRenderer: function(){
    var
    _this = this,
    _value = _this.value,
    _progressView = HView.nu( [4,0, 150, 34, 0, null], _this ),
    // _indicatorPhases = ['/','-','\\','|','/','-','\\','|'], // ascii
    // _indicatorPhases = ['&#9716;','&#9719;','&#9718;','&#9717;'], // unicode sector ball
    // _indicatorPhases = ['&#9681;','&#9682;','&#9680;','&#9683;'], // unicode half ball
    // _indicator = HStringView.nu( [ 2, 2, 32, 32 ], _progressView, { value: _indicatorPhases[0], style: { 'font-size': '24px' } } ),
    // _indicatorTimeout = setInterval( function(){
    //   _indicatorPhase = _indicatorPhases.shift();
    //   _indicatorPhases.push( _indicatorPhase );
    //   _indicator.setValue( _indicatorPhase );
    // }, 100 ),
    _indicatorStr = HStringView.nu( [ 34, 12, 100, 20, 4, null ], _progressView, { value: 'Rendering' } );
    _this.destroyJSONRenderer();
    if( _value.type === undefined || _value.version === undefined ){
      _value = {
        'type': 'GUITree',
        'version': 1.0,
        'class': 'HView',
        'rect': [0,0, null,null, 0,0],
        'options': { 'style': { 'overflow': 'auto' } },
        'subviews': _value
      };
    }
    setTimeout( function(){
      _this.jsonRenderer = JSONRenderer.nu( _value, _this );
      // clearTimeout( _indicatorTimeout );
      _progressView.die();
    }, 10 );
  },
  destroyJSONRenderer: function(){
    if( this.jsonRenderer ){
      this.jsonRenderer.die();
      this.jsonRenderer = false;
    }
  },
  drawSubviews: function(){
    if( this.options.autoCreate ){
      this.createJSONRenderer();
    }
  },
  show: function(){
    this.base();
    if(!this.jsonRenderer){
      this.createJSONRenderer();
    }
  },
  hide: function(){
    this.base();
    if( this.options.autoDestroy ){
      this.destroyJSONRenderer();
    }
  },
  die: function(){
    this.destroyJSONRenderer();
    this.base();
  }
});

var//RSence.Controls
GUITreeTabItem = {
  nu: function( _rect, _parent, _options ){
    if( _rect.hasAncestor && _rect.hasAncestor( HView ) ){
      _options = _parent;
      _parent = _rect;
    }
    else {
      console.warn && console.warn( "Warning: the rect constructor argument of GUITreeTabItem is deprecated." );
    }
    return _parent.addTab( _options.label, _options.select, GUITreeTabView, _options );
  }
};
