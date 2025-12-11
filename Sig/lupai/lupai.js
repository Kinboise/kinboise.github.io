const 形状 = {
'十字路口':
`<g id="形状">
    <rect class="白" x="250" y="96" width="12" height="90" />
    <polyline class="白" points="250 96 262 96 256 90" />
    <rect class="白" x="211" y="138" width="90" height="12" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
</g>`,

'左高右低':
`<g id="形状">
    <rect class="白" x="250" y="96" width="12" height="90" />
    <polyline class="白" points="250 96 262 96 256 90" />
    <rect class="白" x="211" y="120" width="39" height="12" />
    <rect class="白" x="262" y="138" width="39" height="12" />
    <polyline class="白" points="211 132 211 120 205 126" />
    <polyline class="白" points="301 138 301 150 307 144" />
</g>`,

'左低右高':
`<g id="形状">
    <rect class="白" x="250" y="96" width="12" height="90" />
    <polyline class="白" points="250 96 262 96 256 90" />
    <rect class="白" x="211" y="138" width="39" height="12" />
    <rect class="白" x="262" y="120" width="39" height="12" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 120 301 132 307 126" />
</g>`,

'前路偏左':
`<g id="形状">
    <rect class="白" x="238" y="96" width="12" height="42" />
    <rect class="白" x="250" y="150" width="12" height="36" />
    <polyline class="白" points="238 96 250 96 244 90" />
    <rect class="白" x="211" y="138" width="90" height="12" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
</g>`,

'前路偏右':
`<g id="形状">
    <rect class="白" x="262" y="96" width="12" height="42" />
    <rect class="白" x="250" y="150" width="12" height="36" />
    <polyline class="白" points="262 96 274 96 268 90" />
    <rect class="白" x="211" y="138" width="90" height="12" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
</g>`,

'环岛':
`<g id="形状">
<rect class="白" x="250" y="96" width="12" height="90" />
<polyline class="白" points="250 96 262 96 256 90" />
<rect class="白" x="250" y="99" width="12" height="90" transform="translate(400 -112) rotate(90)" />
<polyline class="白" points="211 150 211 138 205 144" />
<polyline class="白" points="301 138 301 150 307 144" />
<circle class="底TAMO" cx="256" cy="144" r="24" />
<path class="白"
    d="M256,132a12,12,0,1,1-12,12,12,12,0,0,1,12-12m0-12a24,24,0,1,0,24,24,24,24,0,0,0-24-24Z" />
<polygon class="底TAMO" points="256.15 144.43 232.08 160.08 240.5 168.5 256.15 144.43" />
</g>`,

'菱形桥上':
`<g id="形状">
    <polyline class="白" points="244 96 256 96 250 90" />
    <rect class="白" x="273.5" y="122.5" width="12" height="43" transform="translate(423.5 -135.5) rotate(90)" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <polygon class="白" points="256 186 250 186 244 186 244 96 256 96 256 186" />
    <path class="白"
        d="M256,186h0l.05-12,0,6,0-6c2.81,0,12-1,12-12V141.71h12V162c0,7-2.17,12.69-6.45,17C266.73,185.77,257.3,186,256,186Z" />
    <rect class="白" x="220.5" y="128.5" width="12" height="31" transform="translate(370.5 -82.5) rotate(90)" />
</g>`,

'菱形桥下':
`<g id="形状">
    <rect class="白" x="244" y="96" width="12" height="40" />
    <polyline class="白" points="244 96 256 96 250 90" />
    <rect class="白" x="250" y="99" width="12" height="90" transform="translate(400 -112) rotate(90)" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <polygon class="白" points="256 186 250 186 244 186 244 152 256 152 256 186" />
    <path class="白"
        d="M256,186h0l.05-12,0,6,0-6c2.81,0,12-1,12-12V141.71h12V162c0,7-2.17,12.69-6.45,17C266.73,185.77,257.3,186,256,186Z" />
</g>`,

'苜蓿桥上':
`<g id="形状">
    <rect class="白" x="240" y="96" width="12" height="90" />
    <polyline class="白" points="240 96 252 96 246 90" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <path class="白" d="M252,186l-8.76-8.2c6.2-6.64,38.17-39.8,57.78-39.8v12C289.8,150,265,172.08,252,186Z" />
    <path class="白"
        d="M260.53,150H254V138h6.53c5.67,0,8.22-3.39,8.23-6.74,0-3.07-2.15-6.38-8.28-6.43-11.13-.1-14.25,0-14.29,0l-.39-12c.13,0,3.26-.1,14.78,0,13.3.12,20.22,9.39,20.18,18.48S273.62,150,260.53,150Z" />
    <rect class="白" x="211" y="138" width="27" height="12" />
</g>`,

'苜蓿桥下':
`<g id="形状">
    <rect class="白" x="240" y="152" width="12" height="34" />
    <polyline class="白" points="240 96 252 96 246 90" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <path class="白" d="M252,186l-8.76-8.2c6.2-6.64,38.17-39.8,57.78-39.8v12C289.8,150,265,172.08,252,186Z" />
    <path class="白"
        d="M260.53,150H211V138h49.53c5.67,0,8.22-3.39,8.23-6.74,0-3.07-2.15-6.38-8.28-6.43-11.13-.1-14.25,0-14.29,0l-.39-12c.13,0,3.26-.1,14.78,0,13.3.12,20.22,9.39,20.18,18.48S273.62,150,260.53,150Z" />
    <rect class="白" x="240" y="96" width="12" height="40" />
</g>`,

'单苜蓿上':
`<g id="形状">
    <polyline class="白" points="234 96 246 96 240 90" />
    <polyline class="白" points="211 150 211 138 205 144" id="polyline7" />
    <polyline class="白" points="301 138 301 150 307 144" id="polyline8" />
    <path class="白" d="m 246,186 -6.76,-8.2 c 6.2,-6.64 42.17,-39.8 61.78,-39.8 v 12 C 289.8,150 259,172.08 246,186 Z" />
    <rect class="白" x="234" y="96" width="12" height="90" />
    <rect class="白" x="211" y="138" width="21" height="12" />
    <rect class="白" x="247.5" y="138" width="2" height="12" />
    <path class="白" d="m 266.82617,113.58594 c -0.34725,-0.0152 -4.03389,-0.14886 -7.9082,2.07031 C 254.85843,117.98152 251,123.55573 251,131.21484 V 169 h 12 v -37.78516 c 0,-4.41105 1.04177,-4.66279 1.88281,-5.14453 0.84104,-0.48174 1.66016,-0.50976 1.66016,-0.50976 l 0.2793,0.0117 0.27929,-0.0137 c 0,0 1.7025,0.01 3.1836,0.71289 1.48109,0.70338 2.63281,0.95201 2.63281,5.41016 0,3.28318 -1.18853,4.0214 -3.07813,5.06641 -1.77241,0.9802 -3.52527,1.25147 -3.75195,1.28515 H 265 v 12 h 1.88477 L 267.19922,150 c 0,0 4.16142,-0.38175 8.44726,-2.75195 4.28584,-2.3702 9.27149,-7.80866 9.27149,-15.56641 0,-8.26697 -4.907,-14.07619 -9.48438,-16.25 -4.30592,-2.04489 -8.1351,-1.87154 -8.60742,-1.8457 z" />
</g>`,

'单苜蓿下':
`<g id="形状">
    <rect class="白" x="234" y="152" width="12" height="34" />
    <rect class="白" x="234" y="96" width="12" height="40" />
    <polyline class="白" points="234 96 246 96 240 90" />
    <path class="白" d="m 246,186 -6.76,-8.2 c 6.2,-6.64 42.17,-39.8 61.78,-39.8 v 12 C 289.8,150 259,172.08 246,186 Z" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <rect class="白" x="249" y="152" width="12" height="17" />
    <path class="白" d="m 266.75,113.58203 c -0.39013,-0.0169 -4.19229,-0.15159 -8.42773,1.86328 C 253.86565,117.56541 249,123.22434 249,131.21484 V 136 h 12 v -4.78516 c 0,-4.07966 1.03455,-4.24667 2.47852,-4.93359 1.44396,-0.68692 3.10937,-0.7207 3.10937,-0.7207 l 0.25586,0.01 0.25781,-0.0117 c 0,0 1.7025,0.01 3.1836,0.71289 1.48109,0.70338 2.63281,0.95201 2.63281,5.41016 0,3.28318 -1.18853,4.0214 -3.07813,5.06641 -1.77241,0.9802 -3.52527,1.25147 -3.75195,1.28515 H 211 v 12 h 55.88477 L 267.19922,150 c 0,0 4.16142,-0.38175 8.44726,-2.75195 4.28584,-2.3702 9.27149,-7.80866 9.27149,-15.56641 0,-8.26697 -4.907,-14.07619 -9.48438,-16.25 -4.36934,-2.07501 -8.3138,-1.87139 -8.68359,-1.84961 z"/>
    <polyline class="白" points="211 150 211 138 205 144" />
</g>`,

'双漩涡桥下':
`<g id="形状">
    <rect x="240" y="131" class="白" width="12" height="55"/>
    <polyline class="白" points="240,96 252,96 246,90 "/>
    <polyline class="白" points="211,117 211,129 205,123 "/>
    <polyline class="白" points="301,138 301,150 307,144 "/>
    <path class="白" d="M252,186l-8.8-8.2c6.2-6.6,38.2-39.8,57.8-39.8v12C289.8,150,265,172.1,252,186z"/>
    <rect x="240" y="96" class="白" width="12" height="19"/>
    <path class="白" d="M249.4,161.7l-4.1-11.3c17.2-6.3,21.5-14.9,21.6-16.4c0-1.5,0-4.1-10.4-5c-7.1-0.6-18.3-0.4-30.2-0.2
        c-4.9,0.1-10.1,0.2-15.2,0.2l-0.1-12c5.1,0,10.2-0.1,15.1-0.2c12.7-0.2,23.7-0.4,31.5,0.2c5.3,0.5,21.4,1.9,21.4,17
        C278.9,142.2,269.7,154.3,249.4,161.7z"/>
</g>`,

'双漩涡桥上':
`<g id="形状">
    <rect x="240" y="96" class="白" width="12" height="90"/>
    <polyline class="白" points="240,96 252,96 246,90 "/>
    <polyline class="白" points="211,117 211,129 205,123 "/>
    <polyline class="白" points="301,138 301,150 307,144 "/>
    <path class="白" d="M252,186l-8.8-8.2c6.2-6.6,38.2-39.8,57.8-39.8v12C289.8,150,265,172.1,252,186z"/>
    <path class="白" d="M249.4,161.7l-4.1-11.3c17.2-6.3,21.5-14.9,21.6-16.4c0-1.6,0-5-9.9-5h-3v-12h3c19.8,0,21.9,11.9,21.9,17
        C278.9,142.2,269.7,154.3,249.4,161.7z"/>
    <rect x="211" y="117" class="白" width="27" height="12"/>
</g>`,

'漩涡桥上':
`<g id="形状">
    <rect x="240" y="96" class="白" width="12" height="90"/>
    <polyline class="白" points="240,96 252,96 246,90 "/>
    <polyline class="白" points="211,122 211,134 205,128 "/>
    <polyline class="白" points="301,138 301,150 307,144 "/>
    <path class="白" d="M252,186l-8.8-8.2c6.2-6.6,38.2-39.8,57.8-39.8v12C289.8,150,265,172.1,252,186z"/>
    <path class="白" d="M278.9,157h-12v-18c0-1.6,0-5-9.9-5h-3v-12h3c19.8,0,21.9,11.9,21.9,17V157z"/>
    <rect x="211" y="122" class="白" width="27" height="12"/>
</g>`,

'漩涡桥下':
`<g id="形状">
    <rect x="240" y="136" class="白" width="12" height="50"/>
    <polyline class="白" points="240,96 252,96 246,90 "/>
    <polyline class="白" points="211,122 211,134 205,128 "/>
    <polyline class="白" points="301,138 301,150 307,144 "/>
    <path class="白" d="M252,186l-8.8-8.2c6.2-6.6,38.2-39.8,57.8-39.8v12C289.8,150,265,172.1,252,186z"/>
    <path class="白" d="M278.9,157h-12v-18c0-1.6,0-5-9.9-5h-46v-12h46c19.8,0,21.9,11.9,21.9,17V157z"/>
    <rect x="240" y="96" class="白" width="12" height="24"/>
</g>`,

'菱形桥低上':
`<g id="形状">
<rect x="250" y="96" class="白" width="12" height="90"/>
<polyline class="白" points="250,96 262,96 256,90 "/>
<rect x="211" y="138" class="白" width="37" height="12"/>
<polyline class="白" points="211,150 211,138 205,144 "/>
<polyline class="白" points="301,138 301,150 307,144 "/>
<path class="白" d="M225,146.9l-10.5-5.8c6.9-12.4,16.9-27.1,25.7-27.1H256v12h-15.3C237.7,127.4,230.5,137,225,146.9z
	 M240.9,125.9L240.9,125.9z"/>
<path class="白" d="M260.8,185.6l-9.5-7.3c0.5-0.7,12.3-16,18.2-21.5c5.9-5.4,23-17.3,23.7-17.8l6.8,9.9
	c-4.8,3.3-18.1,12.7-22.4,16.7C273.3,169.7,264,181.4,260.8,185.6z"/>
<rect x="264" y="138" class="白" width="37" height="12"/>
</g>`,

'菱形桥低下':
`<g id="形状">
    <rect x="250" y="96" class="白" width="12" height="40"/>
    <polyline class="白" points="250,96 262,96 256,90 "/>
    <rect x="211" y="138" class="白" width="90" height="12"/>
    <polyline class="白" points="211,150 211,138 205,144 "/>
    <polyline class="白" points="301,138 301,150 307,144 "/>
    <path class="白" d="M225,146.9l-10.5-5.8c6.9-12.4,16.9-27.1,25.7-27.1H256v12h-15.3C237.7,127.4,230.5,137,225,146.9z
        M240.9,125.9L240.9,125.9z"/>
    <path class="白" d="M260.8,185.6l-9.5-7.3c0.5-0.7,12.3-16,18.2-21.5c5.9-5.4,23-17.3,23.7-17.8l6.8,9.9
        c-4.8,3.3-18.1,12.7-22.4,16.7C273.3,169.7,264,181.4,260.8,185.6z"/>
    <rect x="250" y="152" class="白" width="12" height="34"/>
</g>`,

'环岛桥上':
`<g id="形状">
    <path class="白" d="M260.77,185.9l-1.54-5.8c-.15.04-.23.08-.23.08,2.38-1.23,12-12.97,12-27.18h6c0,17.35-12.06,31.79-16.23,32.9Z"/>
    <polyline class="白" points="250 96 262 96 256 90"/>
    <rect class="白" x="211" y="138" width="90" height="12"/>
    <polyline class="白" points="211 150 211 138 205 144"/>
    <polyline class="白" points="301 138 301 150 307 144"/>
    <path class="底TAMO" d="M256,162c-9.93,0-18-8.08-18-18s8.07-18,18-18,18,8.08,18,18-8.08,18-18,18Z"/>
    <path class="白" d="M256,132c6.62,0,12,5.38,12,12s-5.38,12-12,12-12-5.38-12-12,5.38-12,12-12M256,120c-13.25,0-24,10.75-24,24s10.75,24,24,24,24-10.75,24-24-10.75-24-24-24h0Z"/>
    <rect class="白" x="250" y="96" width="12" height="90"/>
    <rect class="底TAMO" x="248" y="120" width="2" height="48"/>
    <rect class="底TAMO" x="262" y="120" width="2" height="48"/>
</g>`,

'环岛桥下':
`  <g id="_形状" data-name="形状">
    <polyline class="白" points="250 96 262 96 256 90"/>
    <polyline class="白" points="211 150 211 138 205 144"/>
    <polyline class="白" points="301 138 301 150 307 144"/>
    <rect class="白" x="250" y="96" width="12" height="90"/>
    <path class="白" d="M256,131.75c6.75,0,12.25,5.5,12.25,12.25s-5.5,12.25-12.25,12.25-12.25-5.5-12.25-12.25,5.5-12.25,12.25-12.25M256,119.5c-13.53,0-24.5,10.97-24.5,24.5s10.97,24.5,24.5,24.5,24.5-10.97,24.5-24.5-10.97-24.5-24.5-24.5h0Z"/>
    <path class="底TAMO" d="M256,169.5c-14.06,0-25.5-11.44-25.5-25.5s11.44-25.5,25.5-25.5,25.5,11.44,25.5,25.5-11.44,25.5-25.5,25.5ZM256,120.5c-12.96,0-23.5,10.54-23.5,23.5s10.54,23.5,23.5,23.5,23.5-10.54,23.5-23.5-10.54-23.5-23.5-23.5ZM256,157.25c-7.31,0-13.25-5.94-13.25-13.25s5.94-13.25,13.25-13.25,13.25,5.94,13.25,13.25-5.94,13.25-13.25,13.25ZM256,132.75c-6.2,0-11.25,5.05-11.25,11.25s5.05,11.25,11.25,11.25,11.25-5.05,11.25-11.25-5.05-11.25-11.25-11.25Z"/>
    <path class="白" d="M260.77,185.9l-1.54-5.8c-.15.04-.23.08-.23.08,2.38-1.23,12-12.97,12-27.18h6c0,17.35-12.06,31.79-16.23,32.9Z"/>
    <rect class="白" x="211" y="138" width="24" height="12"/>
    <rect class="白" x="277" y="138" width="24" height="12"/>
  </g>`,

'丁字路口左':
`<g id="形状">
    <rect class="白" x="365" y="96" width="12" height="90"/>
    <polyline class="白" points="377 96 365 96 371 90"/>
    <polyline class="白" points="283 138 283 150 277 144"/>
    <path class="白" d="M365.34,185.76c-.47-.36-46.94-35.76-82.34-35.76v-12c39.5,0,87.63,36.68,89.66,38.25l-7.32,9.51Z"/>
</g>`,

'丁字路口右':
`<g id="形状">
    <rect class="白" x="135" y="96" width="12" height="90"/>
    <polyline class="白" points="135 96 147 96 141 90"/>
    <polyline class="白" points="229 138 229 150 235 144"/>
    <path class="白" d="M146.66,185.75l-7.32-9.51c2.03-1.56,50.16-38.25,89.66-38.25v12c-35.46,0-81.88,35.4-82.34,35.75Z"/>
</g>`,

'丁字路口前':
`<g id="形状">
    <rect class="白" x="250" y="146" width="12" height="40"/>
    <rect class="白" x="181" y="142" width="150" height="12"/>
    <polyline class="白" points="181 154 181 142 175 148"/>
    <polyline class="白" points="331 142 331 154 337 148"/>
</g>`,

'三岔路口':
`<g id="形状">
    <rect class="白" x="250" y="146" width="12" height="40"/>
    <rect class="白" x="231.62" y="106.63" width="12" height="51.98" transform="translate(-24.18 206.87) rotate(-45)"/>
    <polyline class="白" points="215 118.49 223.49 110 215 110"/>
    <rect class="白" x="268.38" y="106.63" width="12" height="51.98" transform="translate(374.62 420.41) rotate(-135)"/>
    <polyline class="白" points="297 118.49 288.51 110 297 110"/>
</g>`,

'左长右短':
`<g id="形状">
    <rect class="白" x="365" y="96" width="12" height="90"/>
    <rect class="白" x="283" y="138" width="138" height="12"/>
    <polyline class="白" points="377 96 365 96 371 90"/>
    <polyline class="白" points="283 138 283 150 277 144"/>
    <polyline class="白" points="421 138 421 150 427 144"/>
</g>`,

'右长左短':
`<g id="形状">
    <rect class="白" x="135" y="96" width="12" height="90"/>
    <rect class="白" x="91" y="138" width="138" height="12"/>
    <polyline class="白" points="135 96 147 96 141 90"/>
    <polyline class="白" points="229 138 229 150 235 144"/>
    <polyline class="白" points="91 138 91 150 86 144"/>
</g>`,

'前短':
`<g id="形状">
    <rect class="白" x="250" y="126" width="12" height="60"/>
    <rect class="白" x="181" y="142" width="150" height="12"/>
    <polyline class="白" points="181 154 181 142 175 148"/>
    <polyline class="白" points="331 142 331 154 337 148"/>
    <polyline class="白" points="250 126 262 126 256 120" />
</g>`,
}
const 隐藏 = '$1 style="display:none"'

const svg模板 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 256" width="512" height="256">
<defs>
    <style>
        /*自定义区*/
        .路, .口, .白 {
            fill: #ffffff;
        }
        .底TAMO, .点TAMO, .向TAMO {
            fill: #2e3192;
        }
        .汉 {
            font-family: MiSans, 'MiSans VF', 'MiSans L3';
            font-weight: 600
        }
        .拉 {
            font-family: 'IBM Plex Sans Condensed';
            font-weight: 600;
        }
        .拉 .向TAMO {
            font-size: 30px;
            font-family: 'IBM Plex Sans';
            font-weight: 700;
        }
        /*不变区*/
        .汉 .路, .汉 .向TAMO {
            font-size: 48px;
        }
        .汉 .口 {
            font-size: 38px;
        }
        .汉 .点TAMO {
            font-size: 30px;
        }
        .拉 .路, .拉 .口 {
            font-size: 22px;
        }
        .拉 .点TAMO {
            font-size: 18px;
        }
        .居左 {
            text-anchor: start;
        }
        .居中 {
            text-anchor: middle;
        }
        .居右 {
            text-anchor: end;
        }
    </style>
</defs>
<g id="底板">
    <rect class="底TAMO" width="512" height="256" />
    <path class="白"
        d="M502.55,7A2.45,2.45,0,0,1,505,9.45v237.1a2.45,2.45,0,0,1-2.45,2.45H9.45A2.45,2.45,0,0,1,7,246.55V9.45A2.45,2.45,0,0,1,9.45,7h493.1m0-4H9.45A6.45,6.45,0,0,0,3,9.45v237.1A6.45,6.45,0,0,0,9.45,253h493.1a6.45,6.45,0,0,0,6.45-6.45V9.45A6.45,6.45,0,0,0,502.55,3Z" />
</g>
<g id="形状"></g>
<!--填字区-->
</svg>`

const 填字区 = {
    '四向': `<rect class="白" x="10" y="10" width="84" height="60" />
    <polyline class="底TAMO" points="65 37 75 31.4 85 37 75 15" />
    <rect class="白 点底右" x="339" y="172" width="163" height="51" />
    <rect class="白 点底左" x="10" y="172" width="163" height="51" />
    <rect class="白 点底前" x="339" y="20" width="163" height="51" />
<g class="汉">
    <g class="口 居中">
        <text transform="translate(256 221)">本路口</text>
    </g>
    <g class="路">
        <text class="前 居右" transform="translate(332 57)">前路</text>
        <text class="左 居左" transform="translate(8 141.5)">左路</text>
        <text class="右 居右" transform="translate(502 141.5)">右路</text>
    </g>
    <g class="点TAMO">
        <text class="前 居左" id="点前" transform="translate(340 47)">前点</text>
        <text class="左 居左" id="点左" transform="translate(10 199)">左点</text>
        <text class="右 居右" id="点右" transform="translate(502 199)">右点</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(37 56.89)">方向</text>
    </g>
</g>
<g class="拉">
    <g class="口 居中">
        <text transform="translate(256 243.19)">本路口拉</text>
    </g>
    <g class="路">
        <text class="前 居右" transform="translate(330 80.15)">前路拉</text>
        <text class="左 居左" transform="translate(10 165.15)">左路拉</text>
        <text class="右 居右" transform="translate(502 165.15)">右路拉</text>
    </g>
    <g class="点TAMO">
        <text class="前 居左" id="点前" transform="translate(342 66)">前点拉</text>
        <text class="左 居左" id="点左" transform="translate(12 218)">左点拉</text>
        <text class="右 居右" id="点右" transform="translate(500 218)">右点拉</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(74.5 60.19)">方向拉</text>
    </g>
</g>`,
    '前左': `<rect class="白" x="10" y="10" width="84" height="60" />
    <polyline class="底TAMO" points="65 37 75 31.4 85 37 75 15" />
    <rect class="白 点底左" x="10" y="172" width="216" height="51" />
    <rect class="白 点底前" x="102" y="20" width="148" height="51" />
<g class="汉">
    <g class="口 居中">
        <text transform="translate(360 221)">本路口</text>
    </g>
    <g class="路">
        <text class="前 居中" transform="translate(376 57)">前路</text>
        <text class="左 居左" transform="translate(10 141.5)">左路</text>
    </g>
    <g class="点TAMO">
        <text class="前 居右" id="点前" transform="translate(248 47)">前点</text>
        <text class="左 居左" id="点左" transform="translate(12 199)">左点</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(37 56.89)">方向</text>
    </g>
</g>
<g class="拉">
    <g class="口 居中">
        <text transform="translate(360 243.19)">本路口拉</text>
    </g>
    <g class="路">
        <text class="前 居中" transform="translate(376 80.15)">前路拉</text>
        <text class="左 居左" transform="translate(10 165.15)">左路拉</text>
    </g>
    <g class="点TAMO">
        <text class="前 居右" id="点前" transform="translate(248 66)">前点拉</text>
        <text class="左 居左" id="点左" transform="translate(12 218)">左点拉</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(74.5 60.19)">方向拉</text>
    </g>
</g>`,
    '前右': `<rect class="白" x="10" y="10" width="84" height="60" />
    <polyline class="底TAMO" points="65 37 75 31.4 85 37 75 15" />
    <rect class="白 点底右" x="286" y="172" width="216" height="51" />
    <rect class="白 点底前" x="339" y="20" width="163" height="51" />
<g class="汉">
    <g class="口 居中">
        <text transform="translate(142 221)">本路口</text>
    </g>
    <g class="路">
        <text class="前 居左" transform="translate(98 57)">前路</text>
        <text class="右 居右" transform="translate(502 141.5)">右路</text>
    </g>
    <g class="点TAMO">
        <text class="前 居左" id="点前" transform="translate(340 47)">前点</text>
        <text class="右 居右" id="点右" transform="translate(502 199)">右点</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(37 56.89)">方向</text>
    </g>
</g>
<g class="拉">
    <g class="口 居中">
        <text transform="translate(142 243.19)">本路口拉</text>
    </g>
    <g class="路">
        <text class="前 居左" transform="translate(102 80.15)">前路拉</text>
        <text class="右 居右" transform="translate(502 165.15)">右路拉</text>
    </g>
    <g class="点TAMO">
        <text class="前 居左" id="点前" transform="translate(342 66)">前点拉</text>
        <text class="右 居右" id="点右" transform="translate(500 218)">右点拉</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(74.5 60.19)">方向拉</text>
    </g>
</g>`,
    '左右': `<rect class="白" x="10" y="186" width="84" height="60" />
    <rect class="白" x="418" y="186" width="84" height="60" />
    <polyline class="底TAMO" points="86 212 80.4 202 86 192 64 202"/>
    <polyline class="底TAMO" points="426 212 431.6 202 426 192 448 202"/>
    <rect class="白 点底左" x="10" y="85" width="200" height="51" />
    <rect class="白 点底右" x="302" y="85" width="200" height="51" />
<g class="汉">
    <g class="口 居中">
        <text transform="translate(256 221)">本路口</text>
    </g>
    <g class="路">
        <text class="左 居左" transform="translate(8 54.5)">左路</text>
        <text class="右 居右" transform="translate(502 54.5)">右路</text>
    </g>
    <g class="点TAMO">
        <text class="左 居左" id="点左" transform="translate(10 112.5)">左点</text>
        <text class="右 居右" id="点右" transform="translate(502 112.5)">右点</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(37.27 232.89)">左方向</text>
        <text transform="translate(474.73 232.89)">右方向</text>
    </g>
</g>
<g class="拉">
    <g class="口 居中">
        <text transform="translate(256 243.19)">本路口拉</text>
    </g>
    <g class="路">
        <text class="左 居左" transform="translate(10 78.15)">左路拉</text>
        <text class="右 居右" transform="translate(502 78.15)">右路拉</text>
    </g>
    <g class="点TAMO">
        <text class="左 居左" id="点左" transform="translate(12 130)">左点拉</text>
        <text class="右 居右" id="点右" transform="translate(500 130)">右点拉</text>
    </g>
    <g class="向TAMO 居中">
        <text transform="translate(74.59 236.19)">左方向拉</text>
        <text transform="translate(437.41 236.19)">右方向拉</text>
    </g>
</g>`,
}

const 名牌模板 =
`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="128">
<defs>
    <style>
        .名牌底TAMO {
            fill: #2e3192;
        }
        .名牌边 {
            fill: none;
            stroke: #fff;
            stroke-miterlimit: 10;
            stroke-width: 4px;
        }
        .名牌汉TAMO {
            fill: #fff;
            font-size: 60px;
            font-family: MiSans;
            font-weight: 600;
        }
        .名牌拉TAMO {
            fill: #fff;
            font-size: 28px;
            font-family: 'IBM Plex Sans Condensed';
            font-weight: 600;
            letter-spacing: 0.02em;
        }
    </style>
</defs>
<rect class="名牌底TAMO" width="256" height="128" />
<path class="名牌边" d="M-0.5,5H246.25c2.35,0,4.25,2.79,4.25,6.24V116.76c0,3.45-1.9,6.24-4.25,6.24H-0.5"
    transform="translate(0.5)" />
<text class="名牌汉TAMO" transform="translate(0.79,68.4)">前路汉</text>
<text class="名牌拉TAMO" transform="translate(3.06,105.77)">前路拉</text>
</svg>`

var 结果 = []
var 拉方向 = []

function 单修(选择器, 最长) {
    var 长度 = $(选择器)[0].getBoundingClientRect().width
    if (长度 > 最长) {
        var 倍数 = parseInt(100*最长/长度)/100
        $(选择器).attr('transform', $(选择器).attr('transform')+ 'scale(' + 倍数 + ' 1)')
    }
}
function 全修(单张, 排布) {
    $('#预览').html(单张)
    switch (排布) {
        case '四向':
            单修('.汉 .口 text', 156)
            单修('.拉 .口 text', 496)
            单修('.汉 .路 .前 ', 232)
            单修('.汉 .路 .左', 192)
            单修('.汉 .路 .右', 192)
            单修('.拉 .路 .前 ', 230)
            单修('.拉 .路 .左', 205)
            单修('.拉 .路 .右', 200)
            单修('.汉 .点TAMO .前 ', 162)
            单修('.汉 .点TAMO .左', 162)
            单修('.汉 .点TAMO .右', 162)
            单修('.拉 .点TAMO .前 ', 160)
            单修('.拉 .点TAMO .左', 160)
            单修('.拉 .点TAMO .右', 160)
            break
        case '前左':
            单修('.汉 .口 text', 270)
            单修('.拉 .口 text', 288)
            单修('.汉 .路 .前 ', 240)
            单修('.拉 .路 .前 ', 238)
            单修('.汉 .路 .左', 260)
            单修('.拉 .路 .左', 258)
            单修('.汉 .点TAMO .前 ', 144)
            单修('.拉 .点TAMO .前 ', 142)
            单修('.汉 .点TAMO .左', 215)
            单修('.拉 .点TAMO .左', 213)
            break
        case '前右':
            单修('.汉 .口 text', 270)
            单修('.拉 .口 text', 270)
            单修('.汉 .路 .前 ', 240)
            单修('.拉 .路 .前 ', 238)
            单修('.汉 .路 .右', 260)
            单修('.拉 .路 .右', 258)
            单修('.汉 .点TAMO .前 ', 162)
            单修('.拉 .点TAMO .前 ', 160)
            单修('.汉 .点TAMO .右', 215)
            单修('.拉 .点TAMO .右', 213)
            break
        case '左右':
            单修('.汉 .口 text', 316)
            单修('.拉 .口 text', 314)
            单修('.汉 .路 .左', 244)
            单修('.拉 .路 .左', 242)
            单修('.汉 .路 .右', 244)
            单修('.拉 .路 .右', 242)
            单修('.汉 .点TAMO .左', 198)
            单修('.拉 .点TAMO .左', 196)
            单修('.汉 .点TAMO .右', 198)
            单修('.拉 .点TAMO .右', 196)
            break
    }
    单张 = $('#预览').html()
    return 单张
}

function 读取() {
    if (格式.方向词.value == '帜和语') {
        拉方向 = ['F', 'R', 'P', 'K']
    }
    if (格式.方向词.value == '英语') {
        拉方向 = ['N', 'E', 'S', 'W']
    }
    if (格式.方向词.value == '自定义') {
        if (格式.自定义词.value.length == 4) {
            拉方向 = 格式.自定义词.value.split('')
        } else {
            拉方向 = ['B', 'D', 'N', 'X']
        }
    }
    var 返回 = {
        '口': 信息.汉路口.value,
        '拉口': 信息.拉路口.value,
        '形': [
            信息.形北.value,
            信息.形东.value,
            信息.形南.value,
            信息.形西.value
        ],
        '路': [
            信息.汉路北.value,
            信息.汉路东.value,
            信息.汉路南.value,
            信息.汉路西.value
        ],
        '拉路': [
            信息.拉路北.value,
            信息.拉路东.value,
            信息.拉路南.value,
            信息.拉路西.value
        ],
        '路类': [
            信息.路北类.value,
            信息.路东类.value,
            信息.路南类.value,
            信息.路西类.value,
        ],
        '点': [
            信息.汉点北.value,
            信息.汉点东.value,
            信息.汉点南.value,
            信息.汉点西.value
        ],
        '拉点': [
            信息.拉点北.value,
            信息.拉点东.value,
            信息.拉点南.value,
            信息.拉点西.value
        ],
        '点类': [
            信息.点北类.value,
            信息.点东类.value,
            信息.点南类.value,
            信息.点西类.value,
        ],
        '背景': 格式.背景.value,
        '前景': 格式.前景.value,
        '方向词': ['北','东','南','西'],
        '拉方向词': 拉方向
    }
    return 返回
}

function 生成() {
    var 信息 = 读取()
    结果 = []
    $('#预览区').removeAttr('hidden')
    for (var i=0;i<4;i++) {
        //路口指路牌
        var 单张 = svg模板
        单张 = 单张.replace('#ffffff', 信息.前景)
        单张 = 单张.replace('#2e3192',信息.背景)
        if (信息.形[i] == '丁字路口左' || 信息.形[i] == '左长右短') {
            var 排布 = '前左'
        } else if (信息.形[i] == '丁字路口右' || 信息.形[i] == '右长左短') {
            var 排布 = '前右'
        } else if (信息.形[i] == '丁字路口前' || 信息.形[i] == '前短' || 信息.形[i] == '三岔路口') {
            var 排布 = '左右'
        } else {
            var 排布 = '四向'
        }
        单张 = 单张.replace('<!--填字区-->', 填字区[排布])
        单张 = 单张.replace('右方向拉',信息.拉方向词[(i+1)%4])
        单张 = 单张.replace('左方向拉',信息.拉方向词[(i+3)%4])
        单张 = 单张.replace('右方向',信息.方向词[(i+1)%4])
        单张 = 单张.replace('左方向',信息.方向词[(i+3)%4])
        单张 = 单张.replace('方向拉',信息.拉方向词[i])
        单张 = 单张.replace('方向',信息.方向词[i])

        单张 = 单张.replace('<g id="形状"></g>',形状[信息.形[i]])

        单张 = 单张.replace('本路口',信息.口)
        单张 = 单张.replace('本路口拉',信息.拉口)

        单张 = 单张.replace('前路',信息.路[i])
        单张 = 单张.replace('左路',信息.路[(i+3)%4])
        单张 = 单张.replace('右路',信息.路[(i+1)%4])

        单张 = 单张.replace('前路拉',信息.拉路[i])
        单张 = 单张.replace('左路拉',信息.拉路[(i+3)%4])
        单张 = 单张.replace('右路拉',信息.拉路[(i+1)%4])
        
        单张 = 单张.replace('前点',信息.点[i])
        单张 = 单张.replace('左点',信息.点[(i+3)%4])
        单张 = 单张.replace('右点',信息.点[(i+1)%4])

        if (信息.点[i] == '-') {
            单张 = 单张.replace(/(class="白\s点底前")/g, 隐藏)
        }
        if (信息.点[(i+3)%4] == '-') {
            单张 = 单张.replace(/(class="白\s点底左")/g, 隐藏)
        }
        if (信息.点[(i+1)%4] == '-') {
            单张 = 单张.replace(/(class="白\s点底右")/g, 隐藏)
        }

        if (信息.点类[i] != '一般') {
            单张 = 单张.replace(/(id="点前")/g, '$1 style="fill:' + 格式.前景.value + '" ')
            单张 = 单张.replace(/(class="白\s点底前")/g, '$1 style="fill:' + 格式[信息.点类[i]].value + ';stroke:' + 格式.前景.value + ';stroke-width:3px;rx:1px" ')
        }
        if (信息.点类[(i+3)%4] != '一般') {
            单张 = 单张.replace(/(id="点左")/g, '$1 style="fill:' + 格式.前景.value + '" ')
            单张 = 单张.replace(/(class="白\s点底左")/g, '$1 style="fill:' + 格式[信息.点类[(i+3)%4]].value + ';stroke:' + 格式.前景.value + ';stroke-width:3px;rx:1px" ')
        }
        if (信息.点类[(i+1)%4] != '一般') {
            单张 = 单张.replace(/(id="点右")/g, '$1 style="fill:' + 格式.前景.value + '" ')
            单张 = 单张.replace(/(class="白\s点底右")/g, '$1 style="fill:' + 格式[信息.点类[(i+1)%4]].value + ';stroke:' + 格式.前景.value + ';stroke-width:3px;rx:1px" ')
        }
        
        if (信息.路类[(i+2)%4] == '高速') {
            单张 = 单张.replace(/#2e3192/g, 格式.高速.value)
        }

        单张 = 单张.replace('前点拉',信息.拉点[i])
        单张 = 单张.replace('左点拉',信息.拉点[(i+3)%4])
        单张 = 单张.replace('右点拉',信息.拉点[(i+1)%4])

        单张 = 全修(单张, 排布)
        单张 = 单张.replace(/TAMO/g,i)
        结果.push(单张)

        //道路名牌
        单张 = 名牌模板
        单张 = 单张.replace('#fff', 信息.前景)
        单张 = 单张.replace('#2e3192',信息.背景)
        单张 = 单张.replace('前路汉',信息.路[i])
        单张 = 单张.replace('前路拉',信息.拉路[i])

        $('#预览').html(单张)
        单修('.名牌汉TAMO', 240)
        单修('.名牌拉TAMO', 240)
        单张 = $('#预览').html()

        单张 = 单张.replace(/TAMO/g,i)
        结果.push(单张)
    }
    $('#预览').html('<div>' + 结果.join('</div><div>') + '</div>')
}

function 下载全部() {
    for (i in 结果) {
        if (i % 2 == 0) {
            svgExport.downloadPng(
                结果[i],
                'lk' + 信息.汉路口.value + 拉方向[parseInt(i / 2)],
                {
                    width: 512,
                    height: 256
                }
            )
        } else {
            svgExport.downloadPng(
                结果[i],
                'gl' + 读取().路[parseInt(i / 2)],
                {
                    width: 256,
                    height: 128
                }
            )
        }
    }
}

function 下载全部svg() {
    // 初始化一个zip打包对象
    var zip = new JSZip();
    var svg = zip.folder('svg')
    for (i in 结果) {
        if (i % 2 == 0) {
            svg.file('lk' + 信息.汉路口.value + 拉方向[parseInt(i / 2)] + '.svg', 结果[i])
        } else {
            svg.file('gl' + 读取().路[parseInt(i / 2)] + '.svg', 结果[i])
        }
    }
    // 把打包内容异步转成blob二进制格式
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "路牌.zip");
    });
}