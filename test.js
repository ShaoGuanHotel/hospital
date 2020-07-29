/**
 * 无重复字符的最长子串
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const charts = [...s]
  let maxNum = s.length
  while (maxNum > 1) {
    for (let i = 0; i <= charts.length - maxNum; i++) {
      if ([...new Set(charts.slice(i, i + maxNum))].length === maxNum) {
        return maxNum
      }
    }
    maxNum--
  }
  return 1
}

/**
 * 最长公共前缀
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  let maxLength = Math.min(...strs.map((item) => item.length))
  while (maxLength > 0) {
    const pres = strs.map((str) => str.slice(0, maxLength))
    if ([...new Set(pres)].length === 1) {
      return pres[0]
    }
    maxLength--
  }
  return ''
}
longestCommonPrefix(['flower', 'flow', 'flight'])

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
const lengthOfLink = (link) => {
    let length = 1
    while (link.next) {
        length++
        link = link.next
    }
    return length
}
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
    let parentL = null
    let childL = null
    const length1 = lengthOfLink(l1)
    const length2 = lengthOfLink(l2)
    let minLength = 0
    if (length1 > length2) {
        parentL = l1
        childL = l2
        minLength = length2
    } else {
        parentL = l2
        childL = l1
        minLength = length1
    }
    const ret = parentL
    while(minLength>0){
        const val = parentL.val+childL.val
        if(val>=10){
            if(!parentL.next){
                parentL.next = new ListNode(0)
            }
            parentL.next.val +=1
            parentL.val = val%10
        }else{
            parentL.val = val
        }
        parentL = parentL.next
        childL = childL.next
        minLength--
    }
    return ret
};
