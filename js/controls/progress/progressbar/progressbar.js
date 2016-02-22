
/*** = Description
  ** HProgressBar is a control unit used to convey the progress of a task,
  ** such as a download or file transfer. In other words, it is a component
  ** indicating a percentage of a total task has completed.
  **
  ** Use the maxValue to define the point of progress at the end and use value
  ** to define the point of progress.
  **
***/
var//RSence.Controls
HProgressBar = HControl.extend({
  componentName: "progressbar",

/** The amount of pixels the theme insets the width of the progress bar **/
  themeWidthInset: 2,

/** Sets the width of the progress bar when the value changes. **/
  refreshValue: function(){
    if( this.drawn && this.markupElemIds.value ){
      var _progressWidth = Math.round(100 * this.value);
      if(_progressWidth<0){
        _progressWidth = 0;
      }
      this.setStyleOfPart('value','width',_progressWidth+'%');
    }
  },
  onIdle: function(){
    this.base();
    this.refreshValue();
  }
});
