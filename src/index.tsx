import React, {
  useEffect,
  useState,
  MouseEvent as RMouseEvent,
  TouchEvent as RTouchEvent,
} from "react";
import "./index.css";
import { classNames } from "./utils";
import { Track, Point, ImageBound, SliderCaptchaType } from "./types";
import Slider_Arrow from "./img/slider_arrow.png";
import Slider_Refresh from "./img/slider_refresh.png";
import Slider_Error from "./img/slider_error.png";
import Slider_Success from "./img/slider_success.png";
import Loading from "./components/loading";

const Default_ImageBound = {
  width: 0,
  height: 0,
};

let TrackList: Track[] = [];
let StartPoint: Point = {
  x: 0,
  y: 0,
};

const Spacing = 10; // 间隔
const HAS_CONSOLE = true;
const BG_IMAGE_WIDTH = 295; // 背景图片实际宽度尺寸
const SLIDER_WIDTH = 40; // 滑块宽度
const SAFE_SPACE = BG_IMAGE_WIDTH - SLIDER_WIDTH - Spacing; // 滑动最大距离

const TIPS_TEXT = "Drag the slider to fill the puzzle";

const SliderCaptcha = (props: SliderCaptchaType) => {
  const {
    onSuccess,
    genCaptcha,
    verifyCaptcha,
    tipText = TIPS_TEXT,
    hasRefresh = true,
  } = props;

  const [captchaId, setCaptchaId] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [bgImageBound, setBgImageBound] =
    useState<ImageBound>(Default_ImageBound);
  const [sliderImagBound, setSliderImagBound] =
    useState<ImageBound>(Default_ImageBound);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasSuccess, setHasSuccess] = useState<boolean>(false);
  const [bgImg, setBgImg] = useState("");
  const [sliderImg, setSliderImg] = useState("");
  const [hasLoading, setHasLoading] = useState(true);
  const [visible, setVisible] = useState<boolean>(true);

  const getCaptcha = async () => {
    initConfig();
    setHasLoading(true);
    const data = await genCaptcha();
    setHasLoading(false);
    setCaptchaId(data?.id);
    setBgImg(data?.bgImage);
    setSliderImg(data?.tpImage);
  };

  const printLog = (...params: Array<string | number>) => {
    if (HAS_CONSOLE) {
      console.log(JSON.stringify(params));
    }
  };

  const initConfig = () => {
    TrackList = [];
    setStartTime(new Date().getTime());
    setCaptchaId("");
    setOffset(0);
    setHasError(false);
    setHasSuccess(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    getCaptcha();
    clearAllNodePreventDefault();
  }, []);

  const clearAllNodePreventDefault = () => {
    const root = document.querySelector(".rc-slider-captcha");
    root?.childNodes.forEach((node) => {
      node.addEventListener(
        "touchmove",
        (e: Event) => {
          e.preventDefault();
        },
        false
      );
    });
  };

  const onMouseDown = (e: RMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    start(e.pageX, e.pageY);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    move(e.pageX, e.pageY);
  };

  const onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    end(e.pageX, e.pageY);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const onTouchStart = (e: RTouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    start(touch.clientX, touch.clientY);
    window.addEventListener("touchmove", onTouchMove, false);
    window.addEventListener("touchend", onTouchEnd, false);
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    move(touch.clientX, touch.clientY);
  };

  const onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    end(touch.clientX, touch.clientY);
    window.removeEventListener("touchmove", onTouchMove, false);
    window.removeEventListener("touchend", onTouchEnd, false);
  };

  const start = (x: number, y: number) => {
    TrackList.push({
      x: 0,
      y: 0,
      t: new Date().getTime() - startTime,
    });

    StartPoint = {
      x,
      y,
    };
    printLog("start", x, y);
  };

  const move = (x: number, y: number) => {
    const pageX = Math.round(x);
    const pageY = Math.round(y);
    let move = pageX - StartPoint.x;
    if (move < 0) {
      move = 0;
    } else if (move > SAFE_SPACE) {
      move = SAFE_SPACE;
    }
    const track = {
      x: pageX - StartPoint.x,
      y: pageY - StartPoint.y,
      t: new Date().getTime() - startTime,
    };
    TrackList.push(track);
    setOffset(move);
    printLog("move", pageX, pageY, pageX - StartPoint.x);
  };

  const end = (x: number, y: number) => {
    const pageX = Math.round(x);
    const pageY = Math.round(y);
    const track = {
      x: pageX - StartPoint.x,
      y: pageY - StartPoint.y,
      t: new Date().getTime() - startTime,
    };
    TrackList.push(track);
    setEndTime(new Date().getTime());
    validCaptcha(new Date().getTime());
    printLog("end", pageX, pageY, pageX - StartPoint.x);
  };

  const validCaptcha = async (endTime: number) => {
    const isCorrect = await verifyCaptcha({
      id: captchaId,
      bgImageWidth: bgImageBound.width,
      bgImageHeight: bgImageBound.height,
      startTime,
      endTime,
      trackPointList: TrackList,
    });
    if (!isCorrect) {
      setHasSuccess(false);
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
        getCaptcha();
      }, 1000);
      return;
    }
    setHasError(false);
    setHasSuccess(true);
    setTimeout(() => {
      setVisible(false);
      onSuccess?.(captchaId);
    }, 1000);
  };

  const handleBgImgLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setBgImageBound({
      width: e.currentTarget.width,
      height: e.currentTarget.height,
    });
  };

  const handleSliderImgLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setSliderImagBound({
      width: e.currentTarget.width,
      height: e.currentTarget.height,
    });
  };

  const fillGap = (offset: number) => {
    return (offset / (BG_IMAGE_WIDTH - SLIDER_WIDTH)) * 10;
  };

  const onRefresh = () => {
    getCaptcha();
  };

  return (
    <>
      {visible && (
        <>
          <div className="rc-slider-captcha">
            <div className="rc-slider-captcha-content">
              {hasLoading ? (
                <div className="rc-slider-captcha-loading">
                  <Loading />
                </div>
              ) : (
                <div className="rc-slider-captcha-imgs">
                  <img
                    onLoad={handleBgImgLoad}
                    className="rc-slider-captcha-bg-img"
                    src={bgImg}
                  />
                  <img
                    onLoad={handleSliderImgLoad}
                    style={{ left: offset }}
                    className="rc-slider-captcha-slider-img"
                    src={sliderImg}
                  />
                  {hasRefresh && (
                    <img
                      src={Slider_Refresh}
                      className="rc-slider-captcha-refresh"
                      onClick={onRefresh}
                    />
                  )}
                </div>
              )}

              <div className="rc-slider-move">
                <div className="rc-slider-move-track">
                  {!offset && <span>{tipText}</span>}
                </div>
                <div
                  className={classNames("rc-slider-move-thumb", {
                    error: hasError,
                    success: hasSuccess,
                  })}
                  style={{
                    left: offset + fillGap(offset),
                  }}
                  onMouseDown={onMouseDown}
                  onTouchStart={onTouchStart}
                >
                  {!hasError && hasSuccess && (
                    <img src={Slider_Success} alt="" />
                  )}
                  {hasError && !hasSuccess && <img src={Slider_Error} alt="" />}
                  {!hasError && !hasSuccess && (
                    <img src={Slider_Arrow} alt="" />
                  )}
                </div>
                <div
                  className={classNames("rc-slider-move-percent", {
                    progress: offset > 0,
                    error: hasError,
                    success: hasSuccess,
                  })}
                  style={{
                    width: offset + SLIDER_WIDTH + fillGap(offset),
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="rc-slider-captcha-mask" onClick={onClose}></div>
        </>
      )}
    </>
  );
};

export default SliderCaptcha;
