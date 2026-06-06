/**
 * JavaScript Controller for Simple Machines Interactive Webpage
 */

// Global State
const state = {
  currentTab: 'intro',
  lever: {
    leftWeights: 2,
    leftArm: 3,
    rightWeights: 3,
    rightArm: 2,
    angle: 0
  },
  pulley: {
    activeTab: 'fixed', // 'fixed', 'movable', 'wheel'
    weight: 20, // gw
    ropeDist: 0, // cm
    wheelEffortPos: 'wheel', // 'wheel' or 'axle'
    autoLifting: false,
    liftInterval: null
  },
  transmission: {
    activeTab: 'gear', // 'gear', 'chain', 'belt'
    leftTeeth: 24,
    rightTeeth: 16,
    beltWrap: 'open', // 'open' or 'cross'
    speedRpm: 30,
    isPlaying: true,
    leftAngle: 0,
    rightAngle: 0,
    lastTime: null,
    animationId: null
  },
  life: {
    selectedItem: 'scissors'
  },
  quiz: {
    currentIndex: 0,
    score: 0,
    answers: [], // Array of { questionIdx, selectedOptIdx, isCorrect }
    isAnswered: false,
    questions: [
      {
        question: "國小自然課本中提到「簡單機械」的主要目的，以下哪一個描述是「錯誤」的？",
        options: [
          "有些機械可以幫助我們省力",
          "有些機械可以幫助我們節省時間",
          "有些機械可以改變施力的方向",
          "有些神奇的機械可以同時省力又省功"
        ],
        correct: 3,
        explanation: "「功的原理」指出：使用任何機械都不能省功！雖然機械可以省力或省時間，但在不計摩擦力情況下，輸入的功等於輸出的功。省力的機械必定費距離（費時），省時的機械必定費力。"
      },
      {
        question: "使用剪刀剪鐵皮時，若想更省力，我們應該如何操作？",
        options: [
          "把鐵皮儘量靠近剪刀的支點（刀刃底部），手握在把手的最外側",
          "把鐵皮儘量放在刀尖處，手握在靠近中間螺絲的地方",
          "不管鐵皮放在哪裡，施力大小都一樣",
          "剪刀屬於費力槓桿，無論如何都不可能省力"
        ],
        correct: 0,
        explanation: "剪刀是槓桿的應用。支點在中間螺絲。手握在把手最外側可增加「施力臂」；鐵皮靠近支點可縮短「抗力臂」。根據槓桿原理，施力臂大於抗力臂時最省力！"
      },
      {
        question: "拔釘器（起釘桿）在拔起鐵釘時，它的「支點」、「施力點」、「抗力點」位置關係為何？",
        options: [
          "支點在中間，屬於省力槓桿",
          "抗力點在中間，屬於省力槓桿",
          "施力點在中間，屬於費力槓桿",
          "支點在一端，施力點在中間，屬於省力槓桿"
        ],
        correct: 1,
        explanation: "拔釘器撬起鐵釘時，接觸地面彎曲處是「支點」，咬住釘頭處是「抗力點」，手握長柄處是「施力點」。抗力點在支點與施力點之間（抗力點在中間），此時施力臂大於抗力臂，屬於「省力槓桿」。"
      },
      {
        question: "關於「定滑輪」與「動滑輪」的比較，下列敘述何者正確？",
        options: [
          "定滑輪可以省力一半，但不能改變施力方向",
          "動滑輪不能省力，但可以改變施力方向",
          "定滑輪不省力也不省時，主要功能是改變施力方向",
          "動滑輪可以省力，且手拉繩子的距離等於重物上升的高度"
        ],
        correct: 2,
        explanation: "定滑輪固定在天花板上，不省力也不費力，但可以改變施力方向（拉力朝下即可拉起重物）。動滑輪隨重物移動，省力一半但費時（手拉繩距離為重物上升高度的2倍）。"
      },
      {
        question: "水龍頭旋鈕、方向盤、門把都是「輪軸」的應用。當我們「施力在輪上」來轉動軸時，其力學效益為何？",
        options: [
          "費力但省時（或省距離）",
          "省力但費時（或費距離）",
          "不省力也不費力，只改變施力方向",
          "既省力又省時，是最完美的機械"
        ],
        correct: 1,
        explanation: "輪軸中大圓是輪，小圓是軸。施力在「輪」上是用大圓帶動小圓，施力臂（輪半徑）大於抗力臂（軸半徑），因此是「省力」的，但代價是手旋轉輪的距離大於軸旋轉的距離（費時）。"
      },
      {
        question: "腳踏車是利用齒輪和鏈條來傳送動力的。當腳踩踏板帶動前齒輪（大輪，齒數多）旋轉，進而帶動後齒輪（小輪，齒數少）時，會產生什麼結果？",
        options: [
          "後輪轉速變快，騎起來更省力",
          "後輪轉速變慢，騎起來更省力",
          "後輪轉速變快，騎起來較費力，但能前進得更快（省時）",
          "後輪轉速變慢，旋轉方向與前齒輪相反"
        ],
        correct: 2,
        explanation: "大齒輪帶動小齒輪屬於「省時、費力、加速」的傳動方式。大齒輪踩一圈，小齒輪會轉動更多圈（轉速快），使車速變快，但踩踏板時感覺較重（費力）。另外，鏈條傳動的兩輪旋轉方向相同。"
      },
      {
        question: "兩個互相嚙合（咬合）的齒輪，大齒輪有 30 齒，小齒輪有 10 齒。若大齒輪「順時針」轉了 2 圈，小齒輪會如何轉動？",
        options: [
          "逆時針轉 6 圈",
          "順時針轉 6 圈",
          "逆時針轉 2/3 圈",
          "逆時針轉 2 圈"
        ],
        correct: 0,
        explanation: "互相咬合的兩個齒輪轉動方向相反，所以大齒輪順時針，小齒輪必然是「逆時針」。轉速比與齒數成反比：齒數比為 30:10 = 3:1，所以大齒輪轉 1 圈小齒輪轉 3 圈。大輪轉 2 圈，小輪轉 2 × 3 = 6 圈。"
      },
      {
        question: "小明去工廠參觀，看到一部機器利用皮帶傳送動力。他發現兩個皮帶輪是用「交叉繞法」連接的。當左邊的主動輪順時針旋轉時，右邊的從動輪會如何旋轉？",
        options: [
          "順時針旋轉",
          "逆時針旋轉",
          "不會轉動",
          "一下順時針轉，一下逆時針轉"
        ],
        correct: 1,
        explanation: "皮帶傳動中，如果皮帶是「平行（開放）繞法」，兩輪會同向旋轉；如果是「交叉繞法」，皮帶交叉會使得兩輪轉動方向「相反」。所以左輪順時針，右輪會逆時針旋轉。"
      }
    ]
  }
};

// ================= PAGE ROUTING =================
function go(tabId) {
  // Update state
  state.currentTab = tabId;
  
  // Update navbar styling
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-tab') === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update panels visibility
  document.querySelectorAll('.panel').forEach(panel => {
    if (panel.id === `tab-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Initialize specific tab logic
  if (tabId === 'lever') {
    updateLever();
  } else if (tabId === 'pulley') {
    updatePulleySim();
  } else if (tabId === 'transmission') {
    initTransmission();
  } else if (tabId === 'life') {
    selectLifeItem(state.life.selectedItem);
  } else if (tabId === 'quiz') {
    // Keep quiz state or reset if finished
    if (state.quiz.currentIndex >= state.quiz.questions.length) {
      restartQuiz();
    } else {
      loadQuestion();
    }
  }
}

// ================= 1. LEVER LAB LOGIC =================
function updateLever() {
  // Read DOM Inputs
  const leftW = parseInt(document.getElementById('inputLeftWeights').value);
  const leftD = parseInt(document.getElementById('inputLeftArm').value);
  const rightW = parseInt(document.getElementById('inputRightWeights').value);
  const rightD = parseInt(document.getElementById('inputRightArm').value);

  // Update State
  state.lever.leftWeights = leftW;
  state.lever.leftArm = leftD;
  state.lever.rightWeights = rightW;
  state.lever.rightArm = rightD;

  // Text values
  const leftForce = leftW * 10; // 10gw per weight
  const rightForce = rightW * 10;
  const leftTorque = leftForce * leftD;
  const rightTorque = rightForce * rightD;

  // Update numeric labels in DOM
  document.getElementById('leftWeightsVal').innerText = leftW;
  document.getElementById('leftArmVal').innerText = leftD;
  document.getElementById('rightWeightsVal').innerText = rightW;
  document.getElementById('rightArmVal').innerText = rightD;

  document.getElementById('txtLeftWeight').innerText = leftForce;
  document.getElementById('txtLeftArm').innerText = leftD;
  document.getElementById('txtLeftTorque').innerText = leftTorque;

  document.getElementById('txtRightWeight').innerText = rightForce;
  document.getElementById('txtRightArm').innerText = rightD;
  document.getElementById('txtRightTorque').innerText = rightTorque;

  // Physics logic for tilting beam
  let angle = 0;
  let statusText = "";
  let statusColor = "#fff";

  if (leftTorque === rightTorque) {
    angle = 0;
    statusText = "⚖️ 左右力矩平衡！";
    statusColor = "var(--color-teal)";
  } else if (leftTorque > rightTorque) {
    // Tilt counter-clockwise (negative angle)
    const diff = leftTorque - rightTorque;
    angle = -Math.min(12, 2 + diff * 0.15); // cap the tilt to avoid weight clipping
    statusText = "👈 左邊力矩較大，天平向左傾斜";
    statusColor = "var(--color-cyan)";
  } else {
    // Tilt clockwise (positive angle)
    const diff = rightTorque - leftTorque;
    angle = Math.min(12, 2 + diff * 0.15);
    statusText = "👉 右邊力矩較大，天平向右傾斜";
    statusColor = "var(--color-purple)";
  }

  state.lever.angle = angle;

  // Rotate Beam SVG
  const leverBeam = document.getElementById('leverBeam');
  if (leverBeam) {
    leverBeam.style.transform = `rotate(${angle}deg)`;
  }

  // Update Status Text overlay on SVG
  const txtStatus = document.getElementById('txtBalanceStatus');
  if (txtStatus) {
    txtStatus.textContent = statusText;
    txtStatus.setAttribute('fill', statusColor);
  }

  // Draw Hanging Weights dynamically to keep them vertical
  drawLeverWeights(angle, leftD, leftW, rightD, rightW);

  // Mechanical efficiency analysis
  // Assume Left is Resistance (weight) and Right is Effort (user pull)
  const panelType = document.getElementById('panelLeverType');
  const titleType = document.getElementById('titleLeverType');
  const descType = document.getElementById('descLeverType');

  if (rightD > leftD) {
    panelType.style.borderLeftColor = "var(--color-teal)";
    titleType.style.color = "var(--color-teal)";
    titleType.innerText = "💪 省力槓桿 (施力臂 > 抗力臂)";
    descType.innerHTML = `右側施力臂長度為 <strong>${rightD}</strong> 格，大於左側抗力臂的 <strong>${leftD}</strong> 格。<br>此時，右側只需要較小的施力（如 <strong>${leftForce * leftD / rightD}</strong> gw）即可平衡左側重物。這非常省力，但代價是施力端移動的距離會比較大。`;
  } else if (rightD < leftD) {
    panelType.style.borderLeftColor = "var(--color-orange)";
    titleType.style.color = "var(--color-orange)";
    titleType.innerText = "⚡ 費力槓桿 (施力臂 < 抗力臂)";
    descType.innerHTML = `右側施力臂長度為 <strong>${rightD}</strong> 格，小於左側抗力臂的 <strong>${leftD}</strong> 格。<br>此時，右側需要較大的施力（如 <strong>${leftForce * leftD / rightD}</strong> gw）才能平衡左側重物。這雖然費力，但施力端移動一小段距離，抗力端就能移動很長一段距離（省時）。`;
  } else {
    panelType.style.borderLeftColor = "var(--color-cyan)";
    titleType.style.color = "var(--color-cyan)";
    titleType.innerText = "⚖️ 等臂槓桿 (施力臂 = 抗力臂)";
    descType.innerHTML = `兩側臂長均為 <strong>${leftD}</strong> 格，長度相等。<br>此時需要相等的施力（<strong>${leftForce}</strong> gw）才能維持平衡。這不省力也不費力，通常應用在精準測量質量的天平上。`;
  }
}

function drawLeverWeights(angleDeg, leftD, leftW, rightD, rightW) {
  const angleRad = (angleDeg * Math.PI) / 180;
  
  // Dimensions & Centers
  const cx = 250;
  const cy = 180;
  const unitSpacing = 40; // 40px per unit on the beam

  // Calculate left hanging attachment point
  const xLeft = cx - leftD * unitSpacing * Math.cos(angleRad);
  const yLeft = cy - leftD * unitSpacing * Math.sin(angleRad);

  // Calculate right hanging attachment point
  const xRight = cx + rightD * unitSpacing * Math.cos(angleRad);
  const yRight = cy + rightD * unitSpacing * Math.sin(angleRad);

  // Draw Left Hanger in SVG
  const leftHangerG = document.getElementById('leftHanger');
  if (leftHangerG) {
    let html = `
      <!-- Hanger line goes straight down (gravity) -->
      <line x1="${xLeft}" y1="${yLeft}" x2="${xLeft}" y2="${yLeft + 25}" stroke="#475569" stroke-width="2"/>
      <line x1="${xLeft - 15}" y1="${yLeft + 25}" x2="${xLeft + 15}" y2="${yLeft + 25}" stroke="#475569" stroke-width="2"/>
    `;
    // Stack weights
    for (let i = 0; i < leftW; i++) {
      const wy = yLeft + 27 + i * 11;
      html += `
        <rect x="${xLeft - 12}" y="${wy}" width="24" height="10" rx="2" 
              fill="var(--color-cyan)" stroke="#0f172a" stroke-width="1.5"
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))"/>
      `;
    }
    leftHangerG.innerHTML = html;
  }

  // Draw Right Hanger in SVG
  const rightHangerG = document.getElementById('rightHanger');
  if (rightHangerG) {
    let html = `
      <line x1="${xRight}" y1="${yRight}" x2="${xRight}" y2="${yRight + 25}" stroke="#475569" stroke-width="2"/>
      <line x1="${xRight - 15}" y1="${yRight + 25}" x2="${xRight + 15}" y2="${yRight + 25}" stroke="#475569" stroke-width="2"/>
    `;
    // Stack weights
    for (let i = 0; i < rightW; i++) {
      const wy = yRight + 27 + i * 11;
      html += `
        <rect x="${xRight - 12}" y="${wy}" width="24" height="10" rx="2" 
              fill="var(--color-purple)" stroke="#0f172a" stroke-width="1.5"
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))"/>
      `;
    }
    rightHangerG.innerHTML = html;
  }
}

function resetLever() {
  document.getElementById('inputLeftWeights').value = 2;
  document.getElementById('inputLeftArm').value = 3;
  document.getElementById('inputRightWeights').value = 3;
  document.getElementById('inputRightArm').value = 2;
  updateLever();
}

function toggleLeverExplanation() {
  const panel = document.getElementById('leverExplanation');
  panel.classList.toggle('hidden');
}

// ================= 2. PULLEY & WHEEL/AXLE LOGIC =================
function switchPulleyTab(tabType) {
  state.pulley.activeTab = tabType;
  
  // Update tab buttons style
  document.getElementById('btnSelFixed').classList.toggle('active', tabType === 'fixed');
  document.getElementById('btnSelMovable').classList.toggle('active', tabType === 'movable');
  document.getElementById('btnSelWheel').classList.toggle('active', tabType === 'wheel');

  // Toggle Controls visibility
  const ctrlRope = document.getElementById('ctrlPulleyRope');
  const ctrlWheel = document.getElementById('ctrlWheelRadio');
  const inputRope = document.getElementById('inputPulleyRope');
  
  if (tabType === 'wheel') {
    ctrlRope.style.display = 'flex';
    ctrlWheel.style.display = 'flex';
    // Wheel might have different limits depending on effort position
    inputRope.max = 80;
  } else {
    ctrlRope.style.display = 'flex';
    ctrlWheel.style.display = 'none';
    inputRope.max = 80;
  }

  // Explanation blocks
  document.getElementById('explanationFixed').classList.toggle('hidden', tabType !== 'fixed');
  document.getElementById('explanationMovable').classList.toggle('hidden', tabType !== 'movable');
  document.getElementById('explanationWheel').classList.toggle('hidden', tabType !== 'wheel');

  // Stop auto lift if running
  stopAutoLift();
  
  // Reset rope distance slider
  inputRope.value = 0;

  updatePulleySim();
}

function updatePulleySim() {
  const weightVal = parseInt(document.getElementById('inputPulleyWeight').value);
  const ropeDistVal = parseInt(document.getElementById('inputPulleyRope').value);
  const tabType = state.pulley.activeTab;

  state.pulley.weight = weightVal;
  state.pulley.ropeDist = ropeDistVal;

  // Get wheel effort position if on wheel tab
  if (tabType === 'wheel') {
    const radioVal = document.querySelector('input[name="wheelEffortPos"]:checked').value;
    state.pulley.wheelEffortPos = radioVal;
    
    // adjust max rope pull for axle mode to prevent weight going too high
    const inputRope = document.getElementById('inputPulleyRope');
    if (radioVal === 'axle') {
      inputRope.max = 40;
      if (parseInt(inputRope.value) > 40) {
        inputRope.value = 40;
        state.pulley.ropeDist = 40;
      }
    } else {
      inputRope.max = 80;
    }
  }

  // Math variables
  let effortForce = 0;
  let weightHeight = 0;
  let handRopeDist = ropeDistVal;
  let mechanicalAdvantageText = "";

  const svgG = document.getElementById('pulleyElements');
  if (!svgG) return;

  // Clear SVG group
  let html = "";

  // Dynamic calculations based on mode
  if (tabType === 'fixed') {
    effortForce = weightVal;
    weightHeight = ropeDistVal; // 1:1
    mechanicalAdvantageText = "⚖️ 改變方向，不省力也不費力";

    // SVG Drawing Coordinates
    const r = 24; // Pulley radius
    const cx = 250;
    const cy = 90; // Fixed Pulley center
    const wHeight = 220 - weightHeight * 1.5; // weight bottom y coord
    const hHeight = 90 + handRopeDist * 1.5; // pull hand y coord

    // Wheel angle (rotating with rope)
    const angle = (handRopeDist / (2 * Math.PI * r)) * 360;

    html = `
      <!-- Ceiling bracket -->
      <path d="M 235 30 L 235 45 L 265 45 L 265 30 Z" fill="#4a5568"/>
      <line x1="250" y1="45" x2="250" y2="90" stroke="#4a5568" stroke-width="4"/>

      <!-- Rope over pulley -->
      <!-- Left side rope to weight -->
      <line x1="${cx - r}" y1="${cy}" x2="${cx - r}" y2="${wHeight + 10}" stroke="var(--color-yellow)" stroke-width="2.5" />
      <!-- Right side rope to hand -->
      <line x1="${cx + r}" y1="${cy}" x2="${cx + r}" y2="${hHeight}" stroke="var(--color-yellow)" stroke-width="2.5" />

      <!-- Fixed Pulley Wheel (Rotatable group) -->
      <g style="transform: rotate(${angle}deg); transform-origin: ${cx}px ${cy}px;">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
        <circle cx="${cx}" cy="${cy}" r="${r - 5}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="8,4"/>
        <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#475569" stroke-width="2"/>
        <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#475569" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="5" fill="#1e293b"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="3" fill="#64748b"/>

      <!-- Left Hanging Weight (Hangs from Y = wHeight) -->
      <g transform="translate(${cx - r}, ${wHeight})">
        <!-- Connecting rod/hook -->
        <path d="M 0 0 L 0 10 L -10 18 L 10 18" fill="none" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>
        <!-- Weight shape -->
        <polygon points="-18,18 18,18 12,45 -12,45" fill="var(--color-cyan)" stroke="#0f172a" stroke-width="2"/>
        <text x="0" y="36" font-size="10" font-weight="900" fill="#030712" text-anchor="middle">${weightVal} gw</text>
      </g>

      <!-- Right Pull Hand / Hook (effort point) -->
      <g transform="translate(${cx + r}, ${hHeight})">
        <circle cx="0" cy="0" r="4" fill="var(--color-orange)"/>
        <!-- Effort Arrow pointing down -->
        <path d="M 0 0 L 0 25 M -6 19 L 0 25 L 6 19" fill="none" stroke="var(--color-orange)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="12" y="15" font-size="10" font-weight="900" fill="var(--color-orange)">拉力: ${effortForce} gw</text>
      </g>
      
      <!-- Scale markings -->
      <g font-size="8" fill="var(--text-muted)">
        <text x="195" y="240" text-anchor="end">0 cm</text>
        <text x="195" y="100" text-anchor="end">80 cm</text>
        <line x1="200" y1="230" x2="205" y2="230" stroke="rgba(255,255,255,0.2)"/>
        <line x1="200" y1="110" x2="205" y2="110" stroke="rgba(255,255,255,0.2)"/>
      </g>
    `;
  } else if (tabType === 'movable') {
    effortForce = weightVal / 2;
    weightHeight = ropeDistVal / 2; // 2:1 ratio
    mechanicalAdvantageText = "💪 省力一半！但拉繩距離是物體上升的 2 倍";

    const r = 24; // Pulley radius
    const cx = 250;
    // Movable pulley shifts up by weightHeight * 1.5
    const cy = 210 - weightHeight * 1.5;
    const wHeight = cy + r; // Hook point of weight
    const hHeight = cy - (80 - handRopeDist) * 1.5; // pull hand y coord (pulling up)

    // Wheel angle
    const angle = (handRopeDist / (2 * Math.PI * r)) * 360;

    html = `
      <!-- Fixed Left rope anchor on ceiling -->
      <path d="M 210 30 L 210 40 Q 210 45 215 45 M 215 45 L 235 45" fill="none" stroke="#4a5568" stroke-width="3"/>
      <circle cx="210" cy="30" r="3" fill="#cbd5e1"/>

      <!-- Rope path -->
      <!-- From ceiling (210, 30) down to left side of pulley -->
      <line x1="210" y1="30" x2="210" y2="${cy}" stroke="var(--color-yellow)" stroke-width="2.5" />
      <!-- From right side of pulley up to pull hand -->
      <line x1="${cx + r}" y1="${cy}" x2="${cx + r}" y2="${hHeight}" stroke="var(--color-yellow)" stroke-width="2.5" />
      <!-- Arc wrapping around pulley bottom -->
      <path d="M 226 ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}" fill="none" stroke="var(--color-yellow)" stroke-width="2.5"/>

      <!-- Movable Pulley Wheel (Rotates and moves up) -->
      <g style="transform: translate(0px, 0px) rotate(${angle}deg); transform-origin: ${cx}px ${cy}px;">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
        <circle cx="${cx}" cy="${cy}" r="${r - 5}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="8,4"/>
        <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#475569" stroke-width="2"/>
        <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#475569" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="5" fill="#1e293b"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="3" fill="#64748b"/>

      <!-- Hook frame hanging from pulley center -->
      <path d="M ${cx} ${cy + 5} L ${cx} ${wHeight + 10} L ${cx - 8} ${wHeight + 16} L ${cx + 8} ${wHeight + 16}" fill="none" stroke="#475569" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Hanging Weight (Hangs from Y = wHeight + 16) -->
      <g transform="translate(${cx}, ${wHeight + 16})">
        <polygon points="-18,0 18,0 12,28 -12,28" fill="var(--color-cyan)" stroke="#0f172a" stroke-width="2"/>
        <text x="0" y="18" font-size="10" font-weight="900" fill="#030712" text-anchor="middle">${weightVal} gw</text>
      </g>

      <!-- Hand Pulling Up (effort point) -->
      <g transform="translate(${cx + r}, ${hHeight})">
        <circle cx="0" cy="0" r="4" fill="var(--color-orange)"/>
        <!-- Effort Arrow pointing up -->
        <path d="M 0 0 L 0 -25 M -6 -19 L 0 -25 L 6 -19" fill="none" stroke="var(--color-orange)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="12" y="-12" font-size="10" font-weight="900" fill="var(--color-orange)">拉力: ${effortForce} gw</text>
      </g>
    `;
  } else if (tabType === 'wheel') {
    // Concentric wheel & axle
    const rWheel = 56;
    const rAxle = 26;
    const cx = 250;
    const cy = 150;

    const angle = (handRopeDist / (2 * Math.PI * (state.pulley.wheelEffortPos === 'wheel' ? rWheel : rAxle))) * 360;

    if (state.pulley.wheelEffortPos === 'wheel') {
      // Pulling wheel (larger circle) ->省力
      // Radius ratio: rWheel / rAxle = 56/26 = 2.15
      const ratio = rWheel / rAxle;
      effortForce = Math.round(weightVal / ratio * 10) / 10;
      weightHeight = ropeDistVal / ratio; // weight lifts slower
      mechanicalAdvantageText = `💪 省力輪軸！施力在輪上比值為 ${Math.round(ratio*100)/100} 倍`;

      const wHeight = 230 - weightHeight * 1.5;
      const hHeight = 150 + handRopeDist * 1.5;

      html = `
        <!-- Bearing / Shaft Stand -->
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="280" stroke="#4a5568" stroke-width="5"/>
        <polygon points="${cx},${cy} ${cx-20},280 ${cx+20},280" fill="rgba(255,255,255,0.03)"/>

        <!-- Left Rope on Axle (inner circle) -->
        <line x1="${cx - rAxle}" y1="${cy}" x2="${cx - rAxle}" y2="${wHeight + 10}" stroke="var(--color-yellow)" stroke-width="2" />
        
        <!-- Right Rope on Wheel (outer circle) -->
        <line x1="${cx + rWheel}" y1="${cy}" x2="${cx + rWheel}" y2="${hHeight}" stroke="var(--color-yellow)" stroke-width="2.5" />

        <!-- Wheel and Axle rotatable assembly -->
        <g style="transform: rotate(${-angle}deg); transform-origin: ${cx}px ${cy}px;">
          <!-- Outer Wheel -->
          <circle cx="${cx}" cy="${cy}" r="${rWheel}" fill="rgba(157, 78, 221, 0.15)" stroke="var(--color-purple)" stroke-width="3"/>
          <text x="${cx}" y="${cy - rWheel + 14}" font-size="9" fill="var(--color-purple)" text-anchor="middle" font-weight="700">輪 (Wheel)</text>
          
          <!-- Inner Axle -->
          <circle cx="${cx}" cy="${cy}" r="${rAxle}" fill="rgba(0, 242, 254, 0.2)" stroke="var(--color-cyan)" stroke-width="2.5"/>
          <text x="${cx}" y="${cy + rAxle - 6}" font-size="8" fill="var(--color-cyan)" text-anchor="middle" font-weight="700">軸</text>

          <!-- Spokes -->
          <line x1="${cx}" y1="${cy - rWheel}" x2="${cx}" y2="${cy + rWheel}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <line x1="${cx - rWheel}" y1="${cy}" x2="${cx + rWheel}" y2="${cy}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          
          <circle cx="${cx}" cy="${cy}" r="6" fill="#1e293b"/>
        </g>
        <circle cx="${cx}" cy="${cy}" r="3" fill="#cbd5e1"/>

        <!-- Left Hanging Weight (Hangs from Axle) -->
        <g transform="translate(${cx - rAxle}, ${wHeight})">
          <path d="M 0 0 L 0 10 L -10 18 L 10 18" fill="none" stroke="#475569" stroke-width="2"/>
          <polygon points="-15,18 15,18 10,40 -10,40" fill="var(--color-cyan)" stroke="#0f172a" stroke-width="2"/>
          <text x="0" y="32" font-size="9" font-weight="900" fill="#030712" text-anchor="middle">${weightVal} gw</text>
        </g>

        <!-- Right Pull Hand (Hangs from Wheel) -->
        <g transform="translate(${cx + rWheel}, ${hHeight})">
          <circle cx="0" cy="0" r="4" fill="var(--color-orange)"/>
          <path d="M 0 0 L 0 25 M -6 19 L 0 25 L 6 19" fill="none" stroke="var(--color-orange)" stroke-width="2.5" stroke-linecap="round"/>
          <text x="12" y="15" font-size="10" font-weight="900" fill="var(--color-orange)">拉力: ${effortForce} gw</text>
        </g>
      `;
    } else {
      // Pulling axle (smaller circle) -> 費力
      const ratio = rWheel / rAxle; // 2.15
      effortForce = Math.round(weightVal * ratio * 10) / 10;
      weightHeight = ropeDistVal * ratio; // weight lifts faster
      mechanicalAdvantageText = `⚡ 費力輪軸！施力在軸上比值為 ${Math.round(ratio*100)/100} 倍，但能省移動距離`;

      const wHeight = 230 - weightHeight * 1.5;
      const hHeight = 150 + handRopeDist * 1.5;

      html = `
        <!-- Bearing Stand -->
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="280" stroke="#4a5568" stroke-width="5"/>

        <!-- Left Rope on Wheel (outer circle) -->
        <line x1="${cx - rWheel}" y1="${cy}" x2="${cx - rWheel}" y2="${wHeight + 10}" stroke="var(--color-yellow)" stroke-width="2.5" />
        
        <!-- Right Rope on Axle (inner circle) -->
        <line x1="${cx + rAxle}" y1="${cy}" x2="${cx + rAxle}" y2="${hHeight}" stroke="var(--color-yellow)" stroke-width="2" />

        <!-- Wheel and Axle assembly -->
        <g style="transform: rotate(${angle}deg); transform-origin: ${cx}px ${cy}px;">
          <!-- Outer Wheel -->
          <circle cx="${cx}" cy="${cy}" r="${rWheel}" fill="rgba(0, 242, 254, 0.15)" stroke="var(--color-cyan)" stroke-width="3"/>
          <text x="${cx}" y="${cy - rWheel + 14}" font-size="9" fill="var(--color-cyan)" text-anchor="middle" font-weight="700">輪</text>
          
          <!-- Inner Axle -->
          <circle cx="${cx}" cy="${cy}" r="${rAxle}" fill="rgba(157, 78, 221, 0.2)" stroke="var(--color-purple)" stroke-width="2.5"/>
          <text x="${cx}" y="${cy + rAxle - 6}" font-size="8" fill="var(--color-purple)" text-anchor="middle" font-weight="700">軸 (Axle)</text>

          <!-- Spokes -->
          <line x1="${cx}" y1="${cy - rWheel}" x2="${cx}" y2="${cy + rWheel}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <line x1="${cx - rWheel}" y1="${cy}" x2="${cx + rWheel}" y2="${cy}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          
          <circle cx="${cx}" cy="${cy}" r="6" fill="#1e293b"/>
        </g>
        <circle cx="${cx}" cy="${cy}" r="3" fill="#cbd5e1"/>

        <!-- Left Hanging Weight (Hangs from Wheel) -->
        <g transform="translate(${cx - rWheel}, ${wHeight})">
          <path d="M 0 0 L 0 10 L -10 18 L 10 18" fill="none" stroke="#475569" stroke-width="2"/>
          <polygon points="-15,18 15,18 10,40 -10,40" fill="var(--color-cyan)" stroke="#0f172a" stroke-width="2"/>
          <text x="0" y="32" font-size="9" font-weight="900" fill="#030712" text-anchor="middle">${weightVal} gw</text>
        </g>

        <!-- Right Pull Hand (Hangs from Axle) -->
        <g transform="translate(${cx + rAxle}, ${hHeight})">
          <circle cx="0" cy="0" r="4" fill="var(--color-orange)"/>
          <path d="M 0 0 L 0 25 M -6 19 L 0 25 L 6 19" fill="none" stroke="var(--color-orange)" stroke-width="2.5" stroke-linecap="round"/>
          <text x="12" y="15" font-size="10" font-weight="900" fill="var(--color-orange)">拉力: ${effortForce} gw</text>
        </g>
      `;
    }
  }

  // Update SVG
  svgG.innerHTML = html;

  // Update Data Panel Texts
  document.getElementById('pulleyWeightVal').innerText = weightVal;
  document.getElementById('pulleyRopeDistVal').innerText = ropeDistVal;

  document.getElementById('txtPulleyRes').innerText = `${weightVal} gw`;
  document.getElementById('txtPulleyEff').innerText = `${effortForce} gw`;
  document.getElementById('txtPulleyResDist').innerText = `${Math.round(weightHeight*10)/10} cm`;
  document.getElementById('txtPulleyEffDist').innerText = `${handRopeDist} cm`;
  document.getElementById('txtPulleyAdvantage').innerText = mechanicalAdvantageText;

  // Work done (W = F * S)
  const resWork = Math.round(weightVal * weightHeight);
  const effWork = Math.round(effortForce * handRopeDist);
  document.getElementById('txtResWork').innerText = resWork;
  document.getElementById('txtEffWork').innerText = effWork;
}

function autoLiftPulley() {
  if (state.pulley.autoLifting) {
    stopAutoLift();
    return;
  }

  const inputRope = document.getElementById('inputPulleyRope');
  const maxVal = parseInt(inputRope.max);
  inputRope.value = 0;
  
  state.pulley.autoLifting = true;
  document.getElementById('btnAutoLift').innerText = "⏹ 停止拉繩";
  document.getElementById('btnAutoLift').classList.add('btn-primary');

  state.pulley.liftInterval = setInterval(() => {
    let currVal = parseInt(inputRope.value);
    if (currVal < maxVal) {
      currVal += 2;
      inputRope.value = currVal;
      updatePulleySim();
    } else {
      stopAutoLift();
    }
  }, 40);
}

function stopAutoLift() {
  if (state.pulley.liftInterval) {
    clearInterval(state.pulley.liftInterval);
    state.pulley.liftInterval = null;
  }
  state.pulley.autoLifting = false;
  const btn = document.getElementById('btnAutoLift');
  if (btn) {
    btn.innerText = "▶ 自動拉繩";
    btn.classList.remove('btn-primary');
  }
}

function togglePulleyExplanation() {
  const panel = document.getElementById('pulleyExplanation');
  panel.classList.toggle('hidden');
}

// ================= 3. POWER TRANSMISSION LOGIC =================
function switchTransTab(tabType) {
  state.transmission.activeTab = tabType;
  
  // Style tabs
  document.getElementById('btnSelGear').classList.toggle('active', tabType === 'gear');
  document.getElementById('btnSelChain').classList.toggle('active', tabType === 'chain');
  document.getElementById('btnSelBelt').classList.toggle('active', tabType === 'belt');

  // Toggle option displays
  document.getElementById('ctrlGearTeeth').style.display = tabType === 'gear' ? 'block' : 'none';
  document.getElementById('ctrlBeltType').style.display = tabType === 'belt' ? 'block' : 'none';

  // Toggle science explanations
  document.getElementById('explanationGear').classList.toggle('hidden', tabType !== 'gear');
  document.getElementById('explanationChain').classList.toggle('hidden', tabType !== 'chain');
  document.getElementById('explanationBelt').classList.toggle('hidden', tabType !== 'belt');

  updateTransSim();
}

function initTransmission() {
  // Setup animation frame loop if not already running
  if (!state.transmission.animationId) {
    state.transmission.lastTime = performance.now();
    state.transmission.animationId = requestAnimationFrame(animateTransmission);
  }
  switchTransTab(state.transmission.activeTab);
}

function updateTransSpeed() {
  const speed = parseInt(document.getElementById('inputTransSpeed').value);
  state.transmission.speedRpm = speed;
  document.getElementById('transSpeedVal').innerText = speed;
  
  const btnPlay = document.getElementById('btnPlayTrans');
  if (speed === 0) {
    state.transmission.isPlaying = false;
    btnPlay.innerText = "▶ 啟動";
    btnPlay.classList.remove('btn-primary');
  } else {
    if (!state.transmission.isPlaying) {
      state.transmission.isPlaying = true;
      btnPlay.innerText = "⏸ 暫停";
      btnPlay.classList.add('btn-primary');
    }
  }
}

function togglePlayTrans() {
  const btnPlay = document.getElementById('btnPlayTrans');
  state.transmission.isPlaying = !state.transmission.isPlaying;
  
  if (state.transmission.isPlaying) {
    btnPlay.innerText = "⏸ 暫停";
    btnPlay.classList.add('btn-primary');
    if (state.transmission.speedRpm === 0) {
      document.getElementById('inputTransSpeed').value = 30;
      updateTransSpeed();
    }
  } else {
    btnPlay.innerText = "▶ 啟動";
    btnPlay.classList.remove('btn-primary');
  }
}

function stepTrans() {
  // Turn manually by adding a fixed angle step (e.g. 15 degrees)
  state.transmission.isPlaying = false;
  document.getElementById('btnPlayTrans').innerText = "▶ 啟動";
  document.getElementById('btnPlayTrans').classList.remove('btn-primary');
  
  const tabType = state.transmission.activeTab;
  let ratio = 1;

  if (tabType === 'gear') {
    const leftT = parseInt(document.getElementById('selectGearLeft').value);
    const rightT = parseInt(document.getElementById('selectGearRight').value);
    ratio = leftT / rightT;
  }

  // Left rotates clockwise
  state.transmission.leftAngle += 15;
  
  // Right rotations
  if (tabType === 'gear') {
    state.transmission.rightAngle -= 15 * ratio;
  } else if (tabType === 'chain') {
    state.transmission.rightAngle += 15 * ratio;
  } else if (tabType === 'belt') {
    if (state.transmission.beltWrap === 'open') {
      state.transmission.rightAngle += 15 * ratio;
    } else {
      state.transmission.rightAngle -= 15 * ratio;
    }
  }

  renderTransSVGElements();
}

function updateTransSim() {
  const tabType = state.transmission.activeTab;

  let leftT = 24;
  let rightT = 16;
  
  if (tabType === 'gear') {
    leftT = parseInt(document.getElementById('selectGearLeft').value);
    rightT = parseInt(document.getElementById('selectGearRight').value);
    state.transmission.leftTeeth = leftT;
    state.transmission.rightTeeth = rightT;
  } else {
    // defaults for chain/belt
    leftT = 24;
    rightT = 16;
  }

  if (tabType === 'belt') {
    state.transmission.beltWrap = document.querySelector('input[name="beltWrapType"]:checked').value;
  }

  // Update descriptions and ratio
  const ratio = leftT / rightT;
  let ratioStr = `1 : ${Math.round(ratio * 100) / 100} (${ratio > 1 ? '右輪轉速快' : ratio < 1 ? '右輪轉速慢' : '轉速相等'})`;
  let descText = "";

  if (tabType === 'gear') {
    descText = "齒輪咬合傳動：相鄰齒輪轉動方向「相反」。齒數多的大齒輪轉速慢，齒數少的小齒輪轉速快。";
    document.getElementById('txtTransLeftSize').innerText = `${leftT} 齒 (大)`;
    document.getElementById('txtTransRightSize').innerText = `${rightT} 齒 (小)`;
  } else if (tabType === 'chain') {
    descText = "鏈條與鏈輪傳動：靠鏈條咬合拉動，前後兩輪轉動方向「相同」。傳動力量大且不打滑（如自行車）。";
    document.getElementById('txtTransLeftSize').innerText = "主動鏈輪 (24 齒)";
    document.getElementById('txtTransRightSize').innerText = "從動鏈輪 (16 齒)";
  } else if (tabType === 'belt') {
    if (state.transmission.beltWrap === 'open') {
      descText = "平行皮帶傳動：靠皮帶摩擦力帶動，兩輪轉動方向「相同」。具有緩衝、防過載打滑的保護作用。";
    } else {
      descText = "交叉皮帶傳動：皮帶成 8 字形交叉，兩輪轉動方向「相反」。常用於需要改變轉動方向的工業機械。";
    }
    document.getElementById('txtTransLeftSize').innerText = "主動皮帶輪 (r = 54px)";
    document.getElementById('txtTransRightSize').innerText = "從動皮帶輪 (r = 36px)";
  }

  document.getElementById('txtTransRatio').innerText = ratioStr;
  document.getElementById('txtTransDesc').innerText = descText;

  renderTransSVGElements();
}

function animateTransmission(timestamp) {
  if (state.currentTab !== 'transmission') {
    // stop loop if not active
    state.transmission.animationId = null;
    return;
  }

  const elapsedMs = timestamp - state.transmission.lastTime;
  state.transmission.lastTime = timestamp;

  if (state.transmission.isPlaying && state.transmission.speedRpm > 0) {
    const tabType = state.transmission.activeTab;
    const rpm = state.transmission.speedRpm;
    
    // Degrees per second: rpm * 360 / 60 = rpm * 6
    // Degrees per frame: (rpm * 6) * (elapsedMs / 1000)
    const degPerSec = rpm * 6;
    const deltaDeg = degPerSec * (elapsedMs / 1000);

    let ratio = 1;
    if (tabType === 'gear') {
      ratio = state.transmission.leftTeeth / state.transmission.rightTeeth;
    } else if (tabType === 'chain' || tabType === 'belt') {
      ratio = 24 / 16; // Fixed size ratio 1.5
    }

    state.transmission.leftAngle += deltaDeg;
    
    if (tabType === 'gear') {
      state.transmission.rightAngle -= deltaDeg * ratio; // Reverse
    } else if (tabType === 'chain') {
      state.transmission.rightAngle += deltaDeg * ratio; // Same
    } else if (tabType === 'belt') {
      if (state.transmission.beltWrap === 'open') {
        state.transmission.rightAngle += deltaDeg * ratio; // Same
      } else {
        state.transmission.rightAngle -= deltaDeg * ratio; // Reverse
      }
    }

    // Wrap angles
    state.transmission.leftAngle %= 360;
    state.transmission.rightAngle %= 360;

    // Side panel speed displays
    const leftRpm = rpm;
    const rightRpm = Math.round(rpm * ratio * 10) / 10;
    document.getElementById('txtTransLeftSpeed').innerText = `${leftRpm.toFixed(1)} rpm`;
    document.getElementById('txtTransRightSpeed').innerText = `${rightRpm.toFixed(1)} rpm`;

    document.getElementById('txtTransLeftDir').innerText = "順時針 ↻";
    if (tabType === 'gear' || (tabType === 'belt' && state.transmission.beltWrap === 'cross')) {
      document.getElementById('txtTransRightDir').innerText = "逆時針 ↺";
    } else {
      document.getElementById('txtTransRightDir').innerText = "順時針 ↻";
    }

    renderTransSVGElements();
  }

  state.transmission.animationId = requestAnimationFrame(animateTransmission);
}

function renderTransSVGElements() {
  const svgG = document.getElementById('transElements');
  if (!svgG) return;

  const tabType = state.transmission.activeTab;
  const lAngle = state.transmission.leftAngle;
  const rAngle = state.transmission.rightAngle;

  const cx1 = 170;
  const cy = 160;
  const cx2 = 330; // distance 160px

  let html = "";

  if (tabType === 'gear') {
    // Dynamic Gear mesh math
    // Left: teeth, Right: teeth
    const leftT = state.transmission.leftTeeth;
    const rightT = state.transmission.rightTeeth;
    
    // Scale radii so they add up to exactly 160px
    const totalT = leftT + rightT;
    const r1 = (leftT / totalT) * 160;
    const r2 = (rightT / totalT) * 160;

    // Draw Left Gear
    html += drawSingleGearSVG(cx1, cy, r1, leftT, lAngle, 'var(--color-cyan)', 'rgba(0,242,254,0.1)');
    // Draw Right Gear
    // Note: alignment phase angle is added to ensure teeth mesh cleanly.
    // If left is even/odd, offset right angle slightly
    const meshOffset = 180 / rightT; // Half tooth rotation for right wheel to fit slots
    html += drawSingleGearSVG(cx2, cy, r2, rightT, rAngle + meshOffset, 'var(--color-purple)', 'rgba(157,78,221,0.1)');

    // Mesh Contact Point Arrow
    html += `
      <circle cx="${cx1 + r1}" cy="${cy}" r="3" fill="#ff4d6d"/>
      <circle cx="${cx1}" cy="${cy}" r="5" fill="#fff"/>
      <circle cx="${cx2}" cy="${cy}" r="5" fill="#fff"/>
    `;
  } else if (tabType === 'chain') {
    // Chain drive: Sprockets of fixed size: Large (r = 54px, 24 teeth), Small (r = 36px, 16 teeth)
    const r1 = 54;
    const r2 = 36;

    // Draw sprockets
    html += drawSprocketSVG(cx1, cy, r1, 24, lAngle, 'var(--color-teal)', 'rgba(0,245,160,0.15)');
    html += drawSprocketSVG(cx2, cy, r2, 16, rAngle, 'var(--color-teal)', 'rgba(0,245,160,0.1)');

    // Draw Chain Loops
    // Tangent lines top & bottom
    html += `
      <!-- Chain Outer Links -->
      <line x1="${cx1}" y1="${cy - r1}" x2="${cx2}" y2="${cy - r2}" stroke="#94a3b8" stroke-width="4"/>
      <line x1="${cx1}" y1="${cy + r1}" x2="${cx2}" y2="${cy + r2}" stroke="#94a3b8" stroke-width="4"/>
      <line x1="${cx1}" y1="${cy - r1}" x2="${cx2}" y2="${cy - r2}" stroke="#475569" stroke-width="1.5" stroke-dasharray="8,5"/>
      <line x1="${cx1}" y1="${cy + r1}" x2="${cx2}" y2="${cy + r2}" stroke="#475569" stroke-width="1.5" stroke-dasharray="8,5"/>
    `;

    // Dynamic chain pins rolling animation
    const pinOffset = (lAngle * Math.PI / 180) * r1; // linear travel distance
    html += `
      <!-- Rolling pins on chain -->
      <line x1="${cx1}" y1="${cy - r1}" x2="${cx2}" y2="${cy - r2}" stroke="var(--color-cyan)" stroke-width="3" stroke-dasharray="3,10" stroke-dashoffset="${-pinOffset}"/>
      <line x1="${cx1}" y1="${cy + r1}" x2="${cx2}" y2="${cy + r2}" stroke="var(--color-cyan)" stroke-width="3" stroke-dasharray="3,10" stroke-dashoffset="${pinOffset}"/>
    `;

    html += `
      <circle cx="${cx1}" cy="${cy}" r="5" fill="#fff"/>
      <circle cx="${cx2}" cy="${cy}" r="5" fill="#fff"/>
    `;
  } else if (tabType === 'belt') {
    // Belt drive: Pulleys of fixed size: Large (r = 54px), Small (r = 36px)
    const r1 = 54;
    const r2 = 36;
    const isCross = state.transmission.beltWrap === 'cross';

    // Draw pulleys
    html += drawPulleyWheelSVG(cx1, cy, r1, lAngle, 'var(--color-cyan)', 'rgba(0,242,254,0.1)');
    html += drawPulleyWheelSVG(cx2, cy, r2, rAngle, 'var(--color-purple)', 'rgba(157,78,221,0.1)');

    // Draw Belt
    const beltOffset = (lAngle * Math.PI / 180) * r1; // linear belt motion offset
    if (!isCross) {
      // Parallel open belt
      html += `
        <!-- Parallel Belt -->
        <line x1="${cx1}" y1="${cy - r1}" x2="${cx2}" y2="${cy - r2}" stroke="#cb8531" stroke-width="4" stroke-linecap="round"/>
        <line x1="${cx1}" y1="${cy + r1}" x2="${cx2}" y2="${cy + r2}" stroke="#cb8531" stroke-width="4" stroke-linecap="round"/>
        <!-- Belt textures moving -->
        <line x1="${cx1}" y1="${cy - r1}" x2="${cx2}" y2="${cy - r2}" stroke="#ff9f43" stroke-width="2.5" stroke-dasharray="8,10" stroke-dashoffset="${-beltOffset}"/>
        <line x1="${cx1}" y1="${cy + r1}" x2="${cx2}" y2="${cy + r2}" stroke="#ff9f43" stroke-width="2.5" stroke-dasharray="8,10" stroke-dashoffset="${beltOffset}"/>
      `;
    } else {
      // Crossed 8-belt
      // Center crossed intersection point is at X = cx1 + (r1 / (r1 + r2)) * 160
      // Intersection = 170 + (54/90)*160 = 170 + 96 = 266
      const ix = 266;
      const iy = cy;
      html += `
        <!-- Crossed Belt -->
        <line x1="${cx1}" y1="${cy - r1}" x2="${cx2}" y2="${cy + r2}" stroke="#cb8531" stroke-width="4" stroke-linecap="round"/>
        <line x1="${cx1}" y1="${cy + r1}" x2="${cx2}" y2="${cy - r2}" stroke="#cb8531" stroke-width="4" stroke-linecap="round"/>
        <!-- Belt textures moving -->
        <line x1="${cx1}" y1="${cy - r1}" x2="${cx2}" y2="${cy + r2}" stroke="#ff9f43" stroke-width="2.5" stroke-dasharray="8,10" stroke-dashoffset="${-beltOffset}"/>
        <line x1="${cx1}" y1="${cy + r1}" x2="${cx2}" y2="${cy - r2}" stroke="#ff9f43" stroke-width="2.5" stroke-dasharray="8,10" stroke-dashoffset="${-beltOffset}"/>
      `;
    }

    html += `
      <circle cx="${cx1}" cy="${cy}" r="5" fill="#fff"/>
      <circle cx="${cx2}" cy="${cy}" r="5" fill="#fff"/>
    `;
  }

  svgG.innerHTML = html;
}

// Helper SVG renderers for transmission wheels
function drawSingleGearSVG(cx, cy, r, teeth, angle, color, fillColor) {
  let innerHtml = `
    <!-- Outer boundary circle -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillColor}" stroke="${color}" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 10}" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="4,2"/>
    <circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="${color}" stroke-width="1.5"/>
  `;

  // Draw spoke details
  const spokesCount = teeth > 12 ? 4 : 3;
  for (let i = 0; i < spokesCount; i++) {
    const a = (i * 360 / spokesCount) * Math.PI / 180;
    const x = cx + (r - 10) * Math.cos(a);
    const y = cy + (r - 10) * Math.sin(a);
    innerHtml += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="1.5"/>`;
  }

  // Draw gear teeth (rectangles rotated along circumference)
  for (let i = 0; i < teeth; i++) {
    const toothAngle = i * (360 / teeth);
    // Gear teeth are oriented outwards
    innerHtml += `
      <g transform="rotate(${toothAngle}, ${cx}, ${cy})">
        <rect x="${cx - 4}" y="${cy - r - 4}" width="8" height="8" rx="1.5" fill="${color}"/>
      </g>
    `;
  }

  return `
    <g style="transform: rotate(${angle}deg); transform-origin: ${cx}px ${cy}px;">
      ${innerHtml}
    </g>
  `;
}

function drawSprocketSVG(cx, cy, r, teeth, angle, color, fillColor) {
  let innerHtml = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillColor}" stroke="${color}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${color}" stroke-width="1.5"/>
  `;

  // Spoke lines
  for (let i = 0; i < 5; i++) {
    const a = (i * 72) * Math.PI / 180;
    const x = cx + (r - 4) * Math.cos(a);
    const y = cy + (r - 4) * Math.sin(a);
    innerHtml += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="1.2"/>`;
  }

  // Draw chain grabbing tooth pins
  for (let i = 0; i < teeth; i++) {
    const ta = i * (360 / teeth);
    innerHtml += `
      <circle cx="${cx + r * Math.cos(ta * Math.PI / 180)}" cy="${cy + r * Math.sin(ta * Math.PI / 180)}" r="2" fill="${color}"/>
    `;
  }

  return `
    <g style="transform: rotate(${angle}deg); transform-origin: ${cx}px ${cy}px;">
      ${innerHtml}
    </g>
  `;
}

function drawPulleyWheelSVG(cx, cy, r, angle, color, fillColor) {
  let innerHtml = `
    <!-- Outer pulley rim -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillColor}" stroke="${color}" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 6}" fill="none" stroke="${color}" stroke-width="1"/>
    
    <!-- Central bearing shaft -->
    <circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${color}" stroke-width="1.5"/>
    
    <!-- Pattern indicator line (so user sees rotation) -->
    <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="${color}" stroke-width="2"/>
    <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${color}" stroke-width="2"/>
  `;

  return `
    <g style="transform: rotate(${angle}deg); transform-origin: ${cx}px ${cy}px;">
      ${innerHtml}
    </g>
  `;
}

function toggleTransExplanation() {
  const panel = document.getElementById('transExplanation');
  panel.classList.toggle('hidden');
}

// ================= 4. LIFE APPLICATIONS LOGIC =================
const lifeItemsData = {
  scissors: {
    title: "剪刀",
    type: "槓桿原理 (支點在中間)",
    desc: "剪刀是極為經典的槓桿應用。把手由手握住（施力點），切剪物品的刀刃（抗力點），中間以金屬螺絲固定並轉動（支點）。",
    trivia: "刀刃（抗力臂）越短，握把（施力臂）越長，剪東西時越省力！所以裁剪鐵皮的金屬剪刀手柄極長，裁剪布料或紙雕的剪刀比例則較均勻。",
    tag1: { lbl: "支點 (▲)", val: "中間螺絲固定處" },
    tag2: { lbl: "施力點 (●)", val: "手握剪刀把手處" },
    tag3: { lbl: "抗力點 (■)", val: "刀片接觸物品處" },
    draw: (svg) => {
      svg.innerHTML = `
        <!-- Scissors drawing -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <!-- Blade 1 -->
          <path d="M 60 70 L 170 110 L 200 110 L 290 145 C 310 155 315 130 290 125 L 200 110 L 120 80 Z" fill="rgba(255,255,255,0.06)" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="295" cy="135" r="12" fill="none" stroke="#94a3b8" stroke-width="3"/>
          
          <!-- Blade 2 -->
          <path d="M 60 150 L 170 110 L 200 110 L 290 75 C 310 65 315 90 290 95 L 200 110 L 120 140 Z" fill="rgba(255,255,255,0.06)" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="295" cy="85" r="12" fill="none" stroke="#94a3b8" stroke-width="3"/>
          
          <!-- Sheet of paper being cut -->
          <line x1="45" y1="40" x2="75" y2="180" stroke="var(--color-orange)" stroke-width="3" stroke-dasharray="4,4"/>
          <text x="65" y="35" font-size="8" fill="var(--color-orange)">紙張</text>

          <!-- Fulcrum Point (red) -->
          <circle cx="185" cy="110" r="6" fill="var(--color-red)" filter="drop-shadow(0 0 5px var(--color-red))"/>
          <line x1="185" y1="110" x2="185" y2="60" stroke="var(--color-red)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="185" y="52" font-size="10" font-weight="900" fill="var(--color-red)" text-anchor="middle">支點 (螺絲)</text>

          <!-- Effort Point (cyan) -->
          <circle cx="295" cy="110" r="6" fill="var(--color-cyan)" filter="drop-shadow(0 0 5px var(--color-cyan))"/>
          <line x1="295" y1="110" x2="295" y2="40" stroke="var(--color-cyan)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="295" y="32" font-size="10" font-weight="900" fill="var(--color-cyan)" text-anchor="middle">施力點 (握把)</text>

          <!-- Resistance Point (yellow) -->
          <circle cx="90" cy="100" r="6" fill="var(--color-yellow)" filter="drop-shadow(0 0 5px var(--color-yellow))"/>
          <line x1="90" y1="100" x2="90" y2="50" stroke="var(--color-yellow)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="90" y="42" font-size="10" font-weight="900" fill="var(--color-yellow)" text-anchor="middle">抗力點 (刀口)</text>
        </g>
      `;
    }
  },
  tweezers: {
    title: "鑷子",
    type: "槓桿原理 (施力點在中間)",
    desc: "鑷子常用於夾取精密細物。後端焊死處為旋轉中心（支點），前端口部夾著物體（抗力點），手指夾捏著夾身中段（施力點）。",
    trivia: "因為施力點在支點與抗力點之間（施力臂 < 抗力臂），所以鑷子是「費力槓桿」。雖然費力，但手指移動一小段距離，夾子前端便能夾持微小目標，十分精細省空間。",
    tag1: { lbl: "支點 (▲)", val: "後端相連固定處" },
    tag2: { lbl: "施力點 (●)", val: "手捏夾身中段" },
    tag3: { lbl: "抗力點 (■)", val: "鑷子尖端夾物處" },
    draw: (svg) => {
      svg.innerHTML = `
        <!-- Tweezers drawing -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <!-- Body of Tweezers -->
          <path d="M 320 110 L 100 80 Q 80 80 70 85 L 85 92 L 180 110 Z" fill="rgba(255,255,255,0.06)" stroke="#94a3b8" stroke-width="2"/>
          <path d="M 320 110 L 100 140 Q 80 140 70 135 L 85 128 L 180 110 Z" fill="rgba(255,255,255,0.06)" stroke="#94a3b8" stroke-width="2"/>
          
          <!-- Small diamond/bead being gripped -->
          <polygon points="68,110 74,103 80,110 74,117" fill="var(--color-orange)"/>

          <!-- Fulcrum Point (red) -->
          <circle cx="320" cy="110" r="6" fill="var(--color-red)" filter="drop-shadow(0 0 5px var(--color-red))"/>
          <line x1="320" y1="110" x2="320" y2="50" stroke="var(--color-red)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="320" y="42" font-size="10" font-weight="900" fill="var(--color-red)" text-anchor="middle">支點 (後端)</text>

          <!-- Effort Point (cyan) -->
          <circle cx="180" cy="110" r="6" fill="var(--color-cyan)" filter="drop-shadow(0 0 5px var(--color-cyan))"/>
          <line x1="180" y1="110" x2="180" y2="50" stroke="var(--color-cyan)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="180" y="42" font-size="10" font-weight="900" fill="var(--color-cyan)" text-anchor="middle">施力點 (夾身)</text>

          <!-- Resistance Point (yellow) -->
          <circle cx="74" cy="110" r="6" fill="var(--color-yellow)" filter="drop-shadow(0 0 5px var(--color-yellow))"/>
          <line x1="74" y1="110" x2="74" y2="50" stroke="var(--color-yellow)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="74" y="42" font-size="10" font-weight="900" fill="var(--color-yellow)" text-anchor="middle">抗力點 (夾尖)</text>
        </g>
      `;
    }
  },
  opener: {
    title: "開瓶器",
    type: "槓桿原理 (抗力點在中間)",
    desc: "開啟玻璃瓶蓋時使用的工具。放在瓶蓋中央的開瓶器鐵唇為中心（支點），卡住瓶蓋下緣的鉤齒負責掀蓋（抗力點），手握把手往上扳（施力點）。",
    trivia: "因為抗力點在支點與施力點之間（施力臂 > 抗力臂），所以開瓶器屬於非常省力的「省力槓桿」。手輕輕向上扳，就能產生巨大的力道頂開堅固的鐵製瓶蓋！",
    tag1: { lbl: "支點 (▲)", val: "蓋頂鐵唇支撐處" },
    tag2: { lbl: "施力點 (●)", val: "手握把手尾端處" },
    tag3: { lbl: "抗力點 (■)", val: "鐵鉤卡住蓋緣處" },
    draw: (svg) => {
      svg.innerHTML = `
        <!-- Bottle Opener drawing -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <!-- Glass bottle neck -->
          <path d="M 60 170 L 60 210 M 120 170 L 120 210" stroke="#00f5a0" stroke-width="4" stroke-opacity="0.3"/>
          <path d="M 50 170 L 130 170" stroke="#00f5a0" stroke-width="8" stroke-linecap="square" stroke-opacity="0.4"/>
          <!-- Cap -->
          <rect x="52" y="146" width="76" height="18" fill="#a0a0a0" rx="3" stroke="#505050" stroke-width="1.5"/>
          
          <!-- Opener head -->
          <path d="M 55 138 Q 62 142 80 148 L 78 156 L 68 154 L 64 146 Z" fill="#b0b0b0" stroke="#4a5568" stroke-width="1.5"/>
          <!-- Opener handle going right -->
          <path d="M 72 146 L 270 110 C 285 106 290 124 270 128 L 76 154 Z" fill="rgba(255,255,255,0.06)" stroke="#94a3b8" stroke-width="2"/>

          <!-- Fulcrum Point (red) -->
          <circle cx="90" cy="146" r="6" fill="var(--color-red)" filter="drop-shadow(0 0 5px var(--color-red))"/>
          <line x1="90" y1="146" x2="90" y2="80" stroke="var(--color-red)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="90" y="72" font-size="10" font-weight="900" fill="var(--color-red)" text-anchor="middle">支點 (蓋頂)</text>

          <!-- Effort Point (cyan) -->
          <circle cx="260" cy="118" r="6" fill="var(--color-cyan)" filter="drop-shadow(0 0 5px var(--color-cyan))"/>
          <line x1="260" y1="118" x2="260" y2="60" stroke="var(--color-cyan)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="260" y="52" font-size="10" font-weight="900" fill="var(--color-cyan)" text-anchor="middle">施力點 (把手)</text>

          <!-- Resistance Point (yellow) -->
          <circle cx="68" cy="154" r="6" fill="var(--color-yellow)" filter="drop-shadow(0 0 5px var(--color-yellow))"/>
          <line x1="68" y1="154" x2="68" y2="90" stroke="var(--color-yellow)" stroke-width="1.5" stroke-dasharray="2,2"/>
          <text x="68" y="82" font-size="10" font-weight="900" fill="var(--color-yellow)" text-anchor="middle">抗力點 (鐵鉤)</text>
        </g>
      `;
    }
  },
  doorknob: {
    title: "門把",
    type: "輪軸原理 (施力在輪上)",
    desc: "圓形把手或水平握柄門把是典型的輪軸。手握住轉動的把手外圈相當於「輪」，中間穿過門心連動鎖舌的金屬軸心則是「軸」。",
    trivia: "把手的轉動半徑比內部金屬軸心半徑大很多。當我們握住大圓（輪）旋轉時，只要花費極小的力氣就能帶動緊咬的內部小圓（軸）旋轉收回鎖舌，是省力的應用。",
    tag1: { lbl: "支點 (▲)", val: "鎖軸的中心軸線" },
    tag2: { lbl: "施力點 (●)", val: "手握旋轉門把處" },
    tag3: { lbl: "抗力點 (■)", val: "軸心帶動彈簧鎖處" },
    draw: (svg) => {
      svg.innerHTML = `
        <!-- Doorknob Concentric circles front view -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <!-- Base plate -->
          <circle cx="200" cy="110" r="75" fill="rgba(255,255,255,0.02)" stroke="#475569" stroke-width="1.5"/>
          
          <!-- Outer Wheel (Knob) -->
          <circle cx="200" cy="110" r="54" fill="rgba(157, 78, 221, 0.1)" stroke="var(--color-purple)" stroke-width="3" stroke-dasharray="6,4"/>
          <text x="200" y="80" font-size="9" fill="var(--color-purple)" font-weight="700" text-anchor="middle">輪 (門把外緣)</text>

          <!-- Inner Axle (Spindle) -->
          <circle cx="200" cy="110" r="22" fill="rgba(0, 242, 254, 0.15)" stroke="var(--color-cyan)" stroke-width="2.5"/>
          <text x="200" y="114" font-size="8" fill="var(--color-cyan)" font-weight="700" text-anchor="middle">軸 (鐵芯)</text>

          <!-- Pivot center dot -->
          <circle cx="200" cy="110" r="4" fill="var(--color-red)"/>
          <text x="200" y="145" font-size="9" fill="var(--color-red)" font-weight="900" text-anchor="middle">支點 (軸心點)</text>

          <!-- Hand indicator drawing -->
          <path d="M 235 70 Q 260 70 280 85 M 280 85 L 274 85 M 280 85 L 280 79" fill="none" stroke="var(--color-purple)" stroke-width="2"/>
          <text x="282" y="70" font-size="9" fill="var(--color-purple)" font-weight="900">手握轉動方向 (輪)</text>
          
          <!-- Lock latch moving illustration -->
          <path d="M 200 110 L 140 160 L 90 160" fill="none" stroke="var(--color-cyan)" stroke-width="2" stroke-dasharray="4,2"/>
          <rect x="40" y="148" width="50" height="24" fill="rgba(255,255,255,0.1)" stroke="#cbd5e1" stroke-width="2"/>
          <text x="65" y="163" font-size="9" fill="var(--color-cyan)" font-weight="700" text-anchor="middle">鎖舌</text>
        </g>
      `;
    }
  },
  screwdriver: {
    title: "螺絲起子",
    type: "輪軸原理 (施力在輪上)",
    desc: "螺絲起子用來鎖緊或鬆開螺絲。我們握著的粗大塑膠手柄是「輪」，前端插入螺絲頭的細長金屬鐵桿則是「軸」。",
    trivia: "手柄的半徑比鐵桿粗上數倍。我們旋轉較粗的手柄（輪）時能輕鬆省力；如果反過來只握著細長的鐵桿（軸）旋轉，要旋入木板中幾乎是不可能的。手柄越粗越省力！",
    tag1: { lbl: "支點 (▲)", val: "鐵桿中心軸線處" },
    tag2: { lbl: "施力點 (●)", val: "手握塑膠手柄處" },
    tag3: { lbl: "抗力點 (■)", val: "金屬起子頭與螺絲接觸處" },
    draw: (svg) => {
      svg.innerHTML = `
        <!-- Screwdriver side view -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <!-- Plastic handle (Wheel) -->
          <rect x="230" y="90" width="100" height="40" rx="8" fill="rgba(157, 78, 221, 0.15)" stroke="var(--color-purple)" stroke-width="2"/>
          <path d="M 250 90 L 250 130 M 270 90 L 270 130 M 290 90 L 290 130 M 310 90 L 310 130" stroke="var(--color-purple)" stroke-width="1.5" stroke-opacity="0.3"/>
          <text x="280" y="78" font-size="10" fill="var(--color-purple)" font-weight="700" text-anchor="middle">輪 (粗手柄)</text>

          <!-- Steel rod (Axle) -->
          <rect x="90" y="104" width="140" height="12" fill="rgba(0, 242, 254, 0.15)" stroke="var(--color-cyan)" stroke-width="2"/>
          <polygon points="90,104 70,107 70,113 90,116" fill="rgba(0, 242, 254, 0.2)" stroke="var(--color-cyan)" stroke-width="2"/>
          <text x="160" y="78" font-size="10" fill="var(--color-cyan)" font-weight="700" text-anchor="middle">軸 (細金屬桿)</text>

          <!-- Screw being screwed -->
          <g transform="translate(40, 100)">
            <rect x="0" y="4" width="10" height="12" fill="#888" rx="1"/>
            <polygon points="10,0 30,0 26,20 14,20" fill="#a0a0a0" stroke="#505050" stroke-width="1"/>
            <line x1="10" y1="5" x2="22" y2="5" stroke="#505050" stroke-width="1.5"/>
            <line x1="11" y1="10" x2="21" y2="10" stroke="#505050" stroke-width="1.5"/>
            <line x1="12" y1="15" x2="20" y2="15" stroke="#505050" stroke-width="1.5"/>
          </g>
          <text x="45" y="78" font-size="8" fill="var(--color-yellow)">螺絲</text>

          <!-- Indicators -->
          <circle cx="280" cy="110" r="5" fill="var(--color-purple)"/>
          <text x="280" y="145" font-size="9" fill="var(--color-purple)" font-weight="900" text-anchor="middle">施力點</text>

          <circle cx="75" cy="110" r="5" fill="var(--color-yellow)"/>
          <text x="75" y="145" font-size="9" fill="var(--color-yellow)" font-weight="900" text-anchor="middle">抗力點</text>

          <line x1="70" y1="110" x2="330" y2="110" stroke="var(--color-red)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <circle cx="230" cy="110" r="4" fill="var(--color-red)"/>
          <text x="230" y="145" font-size="9" fill="var(--color-red)" font-weight="900" text-anchor="middle">支點 (中心軸)</text>
        </g>
      `;
    }
  },
  flagpole: {
    title: "升旗桿",
    type: "定滑輪原理 (改變施力方向)",
    desc: "學校操場升國旗時，站在底部的升旗手往下拉動繩子，國旗卻會緩緩向上升起。這是因為旗桿最頂端安裝了一個固定不動的「定滑輪」。",
    trivia: "定滑輪不能省力，升旗手往下拉多少長度的繩子，國旗就往上升多少高度。但它極具便利性，因為我們只要站在地面，將繩子朝下引導拉動即可，無需爬上旗桿頂部推拉旗幟。",
    tag1: { lbl: "滑輪位置", val: "固定在旗桿頂端" },
    tag2: { lbl: "施力方向", val: "往下拉動繩子" },
    tag3: { lbl: "重物上升", val: "國旗垂直向上升" },
    draw: (svg) => {
      svg.innerHTML = `
        <!-- Flagpole and pulley drawing -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <!-- Flagpole -->
          <line x1="160" y1="30" x2="160" y2="210" stroke="#4a5568" stroke-width="5"/>
          
          <!-- Top Pulley wheel -->
          <circle cx="160" cy="30" r="12" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
          <circle cx="160" cy="30" r="3" fill="#1e293b"/>
          <path d="M 154 30 L 154 210" stroke="var(--color-yellow)" stroke-width="1.5"/>
          <path d="M 166 30 L 166 210" stroke="var(--color-yellow)" stroke-width="1.5"/>

          <!-- Flag -->
          <g transform="translate(166, 60)">
            <rect x="0" y="0" width="45" height="30" fill="var(--color-red)"/>
            <rect x="0" y="0" width="22" height="15" fill="#0000ab"/>
            <circle cx="11" cy="7" r="4" fill="#fff"/>
            <text x="11" y="9" font-size="6" fill="#0000ab" font-weight="700" text-anchor="middle">☀️</text>
          </g>

          <!-- Top Pulley Tag (red) -->
          <circle cx="160" cy="30" r="4" fill="var(--color-red)" filter="drop-shadow(0 0 4px var(--color-red))"/>
          <line x1="160" y1="30" x2="110" y2="30" stroke="var(--color-red)" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="105" y="33" font-size="9" font-weight="900" fill="var(--color-red)" text-anchor="end">定滑輪 (軸固定)</text>

          <!-- Flag upward weight (yellow) -->
          <circle cx="166" cy="60" r="4" fill="var(--color-yellow)" filter="drop-shadow(0 0 4px var(--color-yellow))"/>
          <path d="M 180 50 L 180 30 M 176 36 L 180 30 L 184 36" fill="none" stroke="var(--color-yellow)" stroke-width="2"/>
          <text x="186" y="42" font-size="8" fill="var(--color-yellow)">國旗受力向上</text>

          <!-- Pull hand downward force (cyan) -->
          <circle cx="154" cy="150" r="4" fill="var(--color-cyan)" filter="drop-shadow(0 0 4px var(--color-cyan))"/>
          <path d="M 134 140 L 134 160 M 130 154 L 134 160 L 138 154" fill="none" stroke="var(--color-cyan)" stroke-width="2"/>
          <text x="130" y="135" font-size="8" fill="var(--color-cyan)" text-anchor="end">手拉方向向下</text>
        </g>
      `;
    }
  },
  bicycle: {
    title: "腳踏車",
    type: "動力傳送 (齒輪與鏈條)",
    desc: "自行車前進時，雙腳踩動踏板，旋轉前齒輪（主動鏈輪），前齒輪拉動包覆的鏈條，再帶動安裝在後輪軸心上的後齒輪（從動鏈輪）高速旋轉前進。",
    trivia: "前齒輪（大）帶動後齒輪（小）是費力但省時的傳送方式。踏板轉一圈，後輪能轉兩三圈，讓我們快速奔馳！遇到爬坡時，變速自行車可切換成較小的踏板齒輪和較大的後齒輪，以便省力爬坡。",
    tag1: { lbl: "主動輪", val: "前齒盤 (大)" },
    tag2: { lbl: "傳送介質", val: "金屬鏈條" },
    tag3: { lbl: "從動輪", val: "後飛輪 (小)" },
    draw: (svg) => {
      svg.innerHTML = `
        <!-- Bicycle Sprockets and Chain drawing -->
        <g stroke-linecap="round" stroke-linejoin="round">
          <!-- Chain connecting them -->
          <line x1="130" y1="80" x2="280" y2="92" stroke="#475569" stroke-width="3"/>
          <line x1="130" y1="140" x2="280" y2="128" stroke="#475569" stroke-width="3"/>
          <line x1="130" y1="80" x2="280" y2="92" stroke="var(--color-yellow)" stroke-width="1.5" stroke-dasharray="6,4"/>
          <line x1="130" y1="140" x2="280" y2="128" stroke="var(--color-yellow)" stroke-width="1.5" stroke-dasharray="6,4"/>

          <!-- Rear sprocket (Small - Left) -->
          <circle cx="130" cy="110" r="30" fill="rgba(0, 242, 254, 0.15)" stroke="var(--color-cyan)" stroke-width="2.5"/>
          <text x="130" y="70" font-size="9" fill="var(--color-cyan)" font-weight="700" text-anchor="middle">後齒盤 (小飛輪)</text>
          <!-- wheel outline -->
          <circle cx="130" cy="110" r="70" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-dasharray="10,5"/>

          <!-- Front sprocket (Large - Right) -->
          <circle cx="280" cy="110" r="46" fill="rgba(157, 78, 221, 0.15)" stroke="var(--color-purple)" stroke-width="2.5"/>
          <text x="280" y="55" font-size="9" fill="var(--color-purple)" font-weight="700" text-anchor="middle">前齒盤 (踏板大齒)</text>
          
          <!-- Pedal crank -->
          <line x1="280" y1="110" x2="280" y2="160" stroke="#94a3b8" stroke-width="4"/>
          <rect x="268" y="160" width="24" height="8" rx="2" fill="#505050"/>

          <!-- Direction indicators (both rotate clockwise) -->
          <path d="M 315 130 A 40 40 0 0 1 290 152 M 290 152 L 290 146 M 290 152 L 296 150" fill="none" stroke="var(--color-purple)" stroke-width="2"/>
          
          <path d="M 152 125 A 25 25 0 0 1 138 135 M 138 135 L 138 130 M 138 135 L 143 133" fill="none" stroke="var(--color-cyan)" stroke-width="2"/>

          <!-- Labels -->
          <circle cx="280" cy="160" r="4" fill="var(--color-red)"/>
          <text x="280" y="182" font-size="8" fill="var(--color-red)" font-weight="900" text-anchor="middle">施力點 (腳踩踏板)</text>

          <text x="205" y="148" font-size="8" fill="var(--color-yellow)" font-weight="900" text-anchor="middle">傳動鏈條</text>
        </g>
      `;
    }
  }
};

function selectLifeItem(itemId) {
  state.life.selectedItem = itemId;
  
  // Highlight sidebar item
  document.querySelectorAll('.life-item').forEach(item => {
    if (item.getAttribute('data-item') === itemId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const data = lifeItemsData[itemId];
  if (!data) return;

  // Fill Details
  document.getElementById('lifeItemTitle').innerText = data.title;
  document.getElementById('lifeItemType').innerText = data.type;
  document.getElementById('lifeItemDesc').innerText = data.desc;
  document.getElementById('lifeItemTrivia').innerText = data.trivia;

  // Setup tag values
  document.getElementById('tag1-lbl').innerText = itemId === 'flagpole' || itemId === 'bicycle' ? '結構點一' : '支點 (▲)';
  document.getElementById('tag1-val').innerText = data.tag1.val;
  document.getElementById('tag2-lbl').innerText = itemId === 'flagpole' || itemId === 'bicycle' ? '結構點二' : '施力點 (●)';
  document.getElementById('tag2-val').innerText = data.tag2.val;
  document.getElementById('tag3-lbl').innerText = itemId === 'flagpole' || itemId === 'bicycle' ? '結構點三' : '抗力點 (■)';
  document.getElementById('tag3-val').innerText = data.tag3.val;

  // Draw the SVG diagram
  const svg = document.getElementById('svgLifeDiagram');
  data.draw(svg);
}

// ================= 5. QUIZ LOGIC =================
function loadQuestion() {
  const currentIdx = state.quiz.currentIndex;
  const qData = state.quiz.questions[currentIdx];

  // Progress Bar
  const totalQs = state.quiz.questions.length;
  const progressPercent = ((currentIdx) / totalQs) * 100;
  document.getElementById('quizProgressFill').style.width = `${progressPercent}%`;
  document.getElementById('quizProgressText').innerText = `第 ${currentIdx + 1} / ${totalQs} 題`;

  // Question Text
  document.getElementById('questionNumber').innerText = `QUESTION 0${currentIdx + 1}`;
  document.getElementById('questionText').innerText = qData.question;

  // Options buttons
  const optList = document.getElementById('optionsList');
  optList.innerHTML = "";
  
  const optionLetters = ['A', 'B', 'C', 'D'];
  qData.options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.className = "option-btn reveal";
    btn.innerHTML = `
      <span class="option-indicator">${optionLetters[index]}</span>
      <span class="option-content">${optText}</span>
    `;
    btn.onclick = () => selectOption(index);
    optList.appendChild(btn);
  });

  // Hide feedback & next buttons
  document.getElementById('quizFeedback').classList.add('hidden');
  document.getElementById('btnNextQuestion').classList.add('hidden');
  
  state.quiz.isAnswered = false;
}

function selectOption(optionIndex) {
  if (state.quiz.isAnswered) return;
  state.quiz.isAnswered = true;

  const currentIdx = state.quiz.currentIndex;
  const qData = state.quiz.questions[currentIdx];
  const isCorrect = optionIndex === qData.correct;

  // Store answer state
  state.quiz.answers.push({
    questionIdx: currentIdx,
    selectedOptIdx: optionIndex,
    isCorrect: isCorrect
  });

  if (isCorrect) {
    state.quiz.score += 12.5; // 8 questions, each 12.5 points = 100
  }

  // Visual highlights for buttons
  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, index) => {
    btn.setAttribute('disabled', 'true');
    if (index === qData.correct) {
      btn.classList.add('correct');
    } else if (index === optionIndex && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  // Show Feedback Panel
  const feedbackPanel = document.getElementById('quizFeedback');
  const inner = document.getElementById('feedbackInner');
  const title = document.getElementById('feedbackTitle');
  const explain = document.getElementById('feedbackExplain');

  feedbackPanel.classList.remove('hidden');
  if (isCorrect) {
    inner.className = "feedback-inner correct";
    title.innerText = "🎉 回答正確！太棒了！";
    title.className = "feedback-title correct";
  } else {
    inner.className = "feedback-inner wrong";
    title.innerText = "❌ 回答錯誤，別氣餒！";
    title.className = "feedback-title wrong";
  }
  explain.innerText = qData.explanation;

  // Show Next button
  const nextBtn = document.getElementById('btnNextQuestion');
  nextBtn.classList.remove('hidden');
  if (currentIdx === state.quiz.questions.length - 1) {
    nextBtn.innerText = "查看結果 🏆";
  } else {
    nextBtn.innerText = "下一題 →";
  }
}

function nextQuestion() {
  state.quiz.currentIndex++;
  if (state.quiz.currentIndex < state.quiz.questions.length) {
    loadQuestion();
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  // Hide playground, show results
  document.getElementById('quizPlayground').classList.add('hidden');
  
  const resultCard = document.getElementById('quizResultCard');
  resultCard.classList.remove('hidden');

  // Set score
  const finalScore = Math.round(state.quiz.score);
  document.getElementById('resultScore').innerText = `${finalScore} / 100 分`;

  // Set title & desc
  const rBadge = document.getElementById('resultBadge');
  const rTitle = document.getElementById('resultTitle');
  const rDesc = document.getElementById('resultDesc');

  if (finalScore === 100) {
    rBadge.innerText = "👑";
    rTitle.innerText = "完美通關！簡單機械大師！";
    rDesc.innerText = "太不可思議了！你答對了所有題目，對槓桿、滑輪、輪軸與動力傳送的運作原理有極為深刻的理解！你已經具備科學家的素養囉！";
  } else if (finalScore >= 80) {
    rBadge.innerText = "🏆";
    rTitle.innerText = "表現優異！非常優秀！";
    rDesc.innerText = "恭喜你！在這次挑戰中取得非常棒的成績！你已經完全掌握了國小六年級簡單機械的核心概念。";
  } else if (finalScore >= 60) {
    rBadge.innerText = "🎓";
    rTitle.innerText = "恭喜及格！再接再厲！";
    rDesc.innerText = "你已經達到了及格標準，對多數簡單機械都有基本的認識。若對錯題的解析再複習一下，一定能做得更好！";
  } else {
    rBadge.innerText = "🌱";
    rTitle.innerText = "完成挑戰！繼續加油！";
    rDesc.innerText = "感謝你完成所有題目。學習是一場漫長的旅程，建議可以回到實驗室多操作幾次，觀察數據變化，加深理解後再挑戰一次喔！";
  }

  // Render答題紀錄 for review/printing
  const container = document.getElementById('reviewItemsContainer');
  container.innerHTML = "";

  state.quiz.answers.forEach((ans, idx) => {
    const q = state.quiz.questions[ans.questionIdx];
    const letter = ['A', 'B', 'C', 'D'];
    const item = document.createElement('div');
    item.style.padding = "0.5rem 0";
    item.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
    
    item.innerHTML = `
      <div style="font-weight: 700; color: var(--text-bright);">
        第 ${idx+1} 題：${q.question}
      </div>
      <div style="font-size: 0.8rem; margin-top: 0.2rem; display: flex; gap: 1rem;">
        <span style="color: ${ans.isCorrect ? 'var(--color-teal)' : 'var(--color-red)'}; font-weight: 700;">
          ${ans.isCorrect ? '✓ 答對' : '✗ 答錯'}
        </span>
        <span style="color: var(--text-muted);">
          你的答案：${letter[ans.selectedOptIdx]}. ${q.options[ans.selectedOptIdx]}
        </span>
        <span style="color: var(--color-cyan); font-weight: 700;">
          正確答案：${letter[q.correct]}. ${q.options[q.correct]}
        </span>
      </div>
      <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.15rem; font-style: italic;">
        💡 解析：${q.explanation}
      </div>
    `;
    container.appendChild(item);
  });
}

function restartQuiz() {
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.answers = [];
  state.quiz.isAnswered = false;

  document.getElementById('quizPlayground').classList.remove('hidden');
  document.getElementById('quizResultCard').classList.add('hidden');

  loadQuestion();
}

// ================= PAGE INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  // Go to default intro tab
  go('intro');

  // Trigger resize SVG container fits
  window.addEventListener('resize', () => {
    if (state.currentTab === 'lever') {
      updateLever();
    } else if (state.currentTab === 'pulley') {
      updatePulleySim();
    } else if (state.currentTab === 'transmission') {
      updateTransSim();
    }
  });
});
