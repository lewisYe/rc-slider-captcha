# star-slider

React star rating component

## Getting started

用例

```javscript
<SliderCaptcha
  genCaptcha={() => ({
    id: 'slider-captcha',
    bgImage: 'xxx',
    tpImage: 'xxx',
  })}
  verifyCaptcha={() => {
    return true;
  }}
/>
```

## Api
| 参数          | 说明                   | 类型                                     | 默认值 |
| :------------ | ---------------------- | :--------------------------------------- | :----: |
| genCaptcha    | 请求背景图和拼图       | () => Promise<CaptchaData>               |   -    |
| verifyCaptcha | 用户操作滑块完成后触发, 返回true 代表成功 | (data: VerifyParams) => Promise<boolean> |   -    |
| onSuccess     | 验证成功的回调         | (id:string)=>void                        |   -    |
| tipText       | 提示文案               | string                                   |        |
| hasRefresh    | 是否显示刷新按钮       | boolean                                  |  true  |

CaptchaData

```
interface CaptchaData {
  id: string;
  bgImage: string;
  tpImage: string;
}
```

VerifyParams

```
interface VerifyParams {
  id: string;
  bgImageWidth: number;
  bgImageHeight: number;
  startTime: number;
  endTime: number;
  trackPointList: Track[];
}
```

