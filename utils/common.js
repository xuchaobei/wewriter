var CommonUtil = new function(){};

CommonUtil.trim = function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
};

module.exports = CommonUtil;