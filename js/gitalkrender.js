var gitalk = new Gitalk({
    clientID: '431eeec260ac03ffc1ce',
    clientSecret: 'b1507e3f9265df6b42bf6b14d55c777f69aaa6bf',
    repo: 'kinboise.github.io',
    owner: 'Kinboise',
    admin: ['Kinboise'],
    title: '首页 | jepajena',
    distractionFreeMode: false  // Facebook-like distraction free mode
  })
  
  gitalk.render('gitalk-container')