exports = function(activity){
  
  const timeAsString = activity['time'];
  
  return new ISODate(timeAsString)
  
};