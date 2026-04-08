export interface DecisionNode {
  id: string
  question: string
  questionEn: string
  /** Special visual treatment for this node */
  special?: 'easter-egg' | 'final'
  /** Whether this node has a link embedded in the question */
  link?: { text: string; url: string }
  yes: string | ResultNode
  no: string | ResultNode
}

export interface ResultNode {
  result: 'can-deposit' | 'cannot-deposit'
  reason: string
  reasonEn: string
}

function result(canDeposit: boolean, reason: string, reasonEn: string): ResultNode {
  return {
    result: canDeposit ? 'can-deposit' : 'cannot-deposit',
    reason,
    reasonEn,
  }
}

export const decisionTree: Record<string, DecisionNode> = {
  q1: {
    id: 'q1',
    question: '已经TGE了吗？',
    questionEn: 'Has it already had its TGE?',
    yes: 'q2',
    no: 'q3',
  },
  q2: {
    id: 'q2',
    question: '是TVL超过1B的老项目吗？',
    questionEn: 'Is it an established project with TVL over 1B?',
    yes: result(true, 'TVL超过1B的老项目，相对安全', 'Established project with TVL over 1B, relatively safe'),
    no: result(false, 'TGE后TVL不足1B，风险较高', 'Post-TGE with TVL under 1B, higher risk'),
  },
  q3: {
    id: 'q3',
    question: '能7天内赎回吗？',
    questionEn: 'Can you redeem within 7 days?',
    yes: 'q4',
    no: result(false, '无法7天内赎回，流动性风险太高', 'Cannot redeem within 7 days, liquidity risk too high'),
  },
  q4: {
    id: 'q4',
    question: 'APR/收益率达到平均水平了吗？',
    questionEn: 'Has the APR/yield reached the average level?',
    yes: 'q5',
    no: result(false, '收益率未达平均水平，不值得冒险', 'Yield below average level, not worth the risk'),
  },
  q5: {
    id: 'q5',
    question: '出现问题，能赔得起吗？',
    questionEn: 'If something goes wrong, can you afford the loss?',
    yes: 'q6',
    no: result(false, '赔不起就别冲，风险承受能力不足', "Can't afford to lose, insufficient risk tolerance"),
  },
  q6: {
    id: 'q6',
    question: '创始人/团队有污点吗？',
    questionEn: 'Does the founder/team have a bad track record?',
    yes: result(false, '团队有污点，信任风险太高', 'Team has bad track record, trust risk too high'),
    no: 'q7',
  },
  q7: {
    id: 'q7',
    question: '40U天团广子多吗？',
    questionEn: 'Are there many low-cost airdrop farmers (40U gang)?',
    yes: result(false, '项目方广子选人失败，不值得冲', 'Project failed at selecting promoters, not worth rushing in'),
    no: 'q8',
  },
  q8: {
    id: 'q8',
    question: '有审计吗？',
    questionEn: 'Has it been audited?',
    yes: 'q9',
    no: result(false, '审计都请不起，穷比项目', "Can't even afford an audit, broke project"),
  },
  q9: {
    id: 'q9',
    question: '有资产透明度看板吗？',
    questionEn: 'Is there an asset transparency dashboard?',
    yes: 'q10',
    no: result(false, '资产黑箱，肉包子打狗', 'Asset black box, money goes in and never comes out'),
  },
  q10: {
    id: 'q10',
    question: '是多签管理，admin权限低吗？',
    questionEn: 'Is it multi-sig managed with low admin privileges?',
    yes: 'q11',
    no: result(false, '缺乏多签管理，中心化风险太高', 'Lacks multi-sig management, centralization risk too high'),
  },
  q11: {
    id: 'q11',
    question: '你能理解利息从哪来吗？',
    questionEn: 'Do you understand where the yield comes from?',
    yes: 'q12',
    no: result(false, '如果不能理解收益来源，那来源就是你的本金', "If you can't understand the yield source, then the source is your principal"),
  },
  q12: {
    id: 'q12',
    question: '进出磨损<7天利息吗？',
    questionEn: 'Is the entry/exit cost less than 7 days of yield?',
    yes: 'q13',
    no: result(false, '挖的不如亏的多，别存了', 'You lose more than you earn, don\'t bother'),
  },
  q13: {
    id: 'q13',
    question: '有KOL/机构同车吗？',
    questionEn: 'Are there KOLs or institutions also invested?',
    yes: 'q14',
    no: result(false, '缺乏KOL/机构同车，真有问题不好维权', 'No KOLs/institutions on board, hard to seek recourse if things go wrong'),
  },
  q14: {
    id: 'q14',
    question: '朝令夕改，项目方拍脑袋做决策吗？',
    questionEn: 'Do the rules change constantly? Does the team make impulsive decisions?',
    yes: result(false, '规则朝令夕改，项目方决策随意，不靠谱', 'Rules change constantly, team makes impulsive decisions, unreliable'),
    no: 'q15',
  },
  q15: {
    id: 'q15',
    question: '看起来比 USD.萌 好吗？',
    questionEn: 'Does it look better than USD.Meng?',
    link: { text: 'USD.萌', url: 'https://usdm.menglayer.cc' },
    yes: 'q16',
    no: result(false, '连USD.萌都不如的项目，垃圾吧到吧', "A project worse than USD.Meng? Trash it"),
  },
  q16: {
    id: 'q16',
    question: '你今天进门是先迈的左脚吗？',
    questionEn: 'Did you step through the door with your left foot first today?',
    special: 'easter-egg',
    yes: result(true, '恭喜！天时地利人和，可以冲了！🚀', 'Congrats! Stars are aligned, go for it! 🚀'),
    no: result(false, '今天运气不好，改天再来吧 😅', 'Bad luck today, try again another day 😅'),
  },
}

export const ROOT_NODE_ID = 'q1'

/** Total number of unique questions in the tree */
export const TOTAL_QUESTIONS = Object.keys(decisionTree).length

/** Calculate the maximum depth of the tree for progress tracking */
export function getMaxDepth(): number {
  return TOTAL_QUESTIONS
}
