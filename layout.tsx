import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, Part } from '@google/generative-ai'

export const maxDuration = 120

const SYSTEM_PROMPT = `あなたは40年以上のキャリアを持つ、日本最高峰のプロ手相占い師です。
依頼者の手のひら画像と個人情報を総合的に分析し、以下の全診断項目について詳しく鑑定してください。

【鑑定の心得】
- 線や紋様が画像で確認できない場合は「この手相では確認できませんでした」と記載
- 確認できた線・紋様は、その人の個人情報と組み合わせて具体的かつ詳細に解説
- 否定的な内容も正直に、ただし建設的な表現で伝える
- 占い師らしい格調ある言葉遣いで記述する

【出力フォーマット】
必ず以下のJSON形式のみで返答してください（前後の説明文不要）：

{
  "四大基本線": {
    "生命線": "診断内容",
    "知能線": "診断内容",
    "感情線": "診断内容",
    "運命線": "診断内容"
  },
  "主要補助線": {
    "太陽線": "診断内容",
    "財運線": "診断内容",
    "結婚線": "診断内容",
    "健康線": "診断内容"
  },
  "特殊線・紋様": {
    "仏眼線": "診断内容",
    "ソロモンの環": "診断内容",
    "金星帯": "診断内容",
    "神秘十字線": "診断内容",
    "覇王線": "診断内容",
    "ラッキーM": "診断内容"
  },
  "性格・行動": {
    "向上線": "診断内容",
    "旅行線": "診断内容",
    "成り上がり線": "診断内容",
    "反抗線": "診断内容",
    "直感線": "診断内容",
    "放縦線": "診断内容"
  },
  "ラッキーサイン": {
    "フィッシュ": "診断内容",
    "スター": "診断内容",
    "スクエア": "診断内容"
  },
  "総評": "200〜300字程度の総合鑑定コメント"
}`

const COMPAT_PROMPT = `あなたは40年以上のキャリアを持つ、日本最高峰のプロ手相占い師です。
二人の手のひら画像と個人情報をもとに、それぞれの手相診断と二人の相性鑑定を行ってください。

【出力フォーマット】
必ず以下のJSON形式のみで返答してください：

{
  "personA": {
    "四大基本線": { "生命線": "", "知能線": "", "感情線": "", "運命線": "" },
    "主要補助線": { "太陽線": "", "財運線": "", "結婚線": "", "健康線": "" },
    "特殊線・紋様": { "仏眼線": "", "ソロモンの環": "", "金星帯": "", "神秘十字線": "", "覇王線": "", "ラッキーM": "" },
    "性格・行動": { "向上線": "", "旅行線": "", "成り上がり線": "", "反抗線": "", "直感線": "", "放縦線": "" },
    "ラッキーサイン": { "フィッシュ": "", "スター": "", "スクエア": "" },
    "総評": ""
  },
  "personB": {
    "四大基本線": { "生命線": "", "知能線": "", "感情線": "", "運命線": "" },
    "主要補助線": { "太陽線": "", "財運線": "", "結婚線": "", "健康線": "" },
    "特殊線・紋様": { "仏眼線": "", "ソロモンの環": "", "金星帯": "", "神秘十字線": "", "覇王線": "", "ラッキーM": "" },
    "性格・行動": { "向上線": "", "旅行線": "", "成り上がり線": "", "反抗線": "", "直感線": "", "放縦線": "" },
    "ラッキーサイン": { "フィッシュ": "", "スター": "", "スクエア": "" },
    "総評": ""
  },
  "相性": {
    "スコア": 85,
    "恋愛相性": "診断内容",
    "仕事相性": "診断内容",
    "信頼関係": "診断内容",
    "総評": "二人の相性についての総合コメント200〜300字"
  }
}`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { mode, personA, personB } = body

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
    })

    let prompt = ''
    const parts: Part[] = []

    if (mode === 'solo') {
      prompt = `${SYSTEM_PROMPT}

【依頼者情報】
生年月日：${personA.birthdate}
性別：${personA.gender}
職業：${personA.job || '未記入'}

上記の手のひら画像を鑑定し、JSONのみで返答してください。`
      
      parts.push({ text: prompt })
      parts.push({
        inlineData: {
          mimeType: personA.imageMime || 'image/jpeg',
          data: personA.imageBase64,
        }
      })
    } else {
      prompt = `${COMPAT_PROMPT}

【${personA.name}（Aさん）の情報】
生年月日：${personA.birthdate}
性別：${personA.gender}
職業：${personA.job || '未記入'}

【${personB.name}（Bさん）の情報】
生年月日：${personB.birthdate}
性別：${personB.gender}
職業：${personB.job || '未記入'}

1枚目がAさん（${personA.name}）、2枚目がBさん（${personB.name}）の手のひらです。
JSONのみで返答してください。`

      parts.push({ text: prompt })
      parts.push({
        inlineData: {
          mimeType: personA.imageMime || 'image/jpeg',
          data: personA.imageBase64,
        }
      })
      parts.push({
        inlineData: {
          mimeType: personB.imageMime || 'image/jpeg',
          data: personB.imageBase64,
        }
      })
    }

    const result = await model.generateContent(parts)
    const text = result.response.text()
    
    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
    }
    
    const data = JSON.parse(jsonMatch[0])
    return NextResponse.json({ result: data })
    
  } catch (e: unknown) {
    console.error(e)
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
