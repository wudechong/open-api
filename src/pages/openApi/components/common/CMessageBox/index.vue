<template>
  <div class="wln-message" v-show="isShowMessageBox">
    <div class="message-box">
      <h4 class="message-header">
        <span>{{ title }}</span>
        <i class="iconfont icon-cuo icon-message-close" v-show="isShowCloseBtn" @click="cancel"></i>
      </h4>
      <div class="message-body" :style="{alignItems: align}" v-if="!isShowInput">
        <div class="y-center">
          <i class=" iconfont icon-tips iconjichuxinxitishi icon-info" v-if="type === 'info'"></i>
          <i class=" iconfont icon-tips iconzhongjinggaotishiicon icon-warning" v-if="type === 'warning'"></i>
          <i class=" iconfont icon-tips iconbaocuo icon-error" v-if="type === 'error'"></i>
          <i class=" iconfont icon-tips iconjichuxinxitishiwenhao icon-info" v-if="type === 'why'"></i>
          <span v-show='!isHtml'>{{ content }}</span>
          <span v-show='isHtml' v-html="content"></span>
        </div>
        <div class="y-center">
          <div class="icon-tips"></div>
          <el-checkbox class='check-box' v-show="isChecked" v-model="checked">不再提醒</el-checkbox>
        </div>
      </div>
      <div class="message-body y-center" :style="{alignItems: align}" v-if="isShowInput">
        <div class='input-box'>
          <span>{{inputTitle}}：</span>
          <el-input type="text" v-model="inputValue" ref="input" style='width: 200px;' />
        </div>
      </div>

      <div class="message-btn-box">
        <div class='message-btn' :class="[confirmBtnDark? 'message-btn-success': '']" @click="confirm($event)" v-show="isShowConfirmBtn">{{ confirmBtnText }}</div>
        <div class="message-btn" @click="cancel($event)" v-show="isShowCancelBtn">{{ cancelBtnText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CMessageBox',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: '弹框内容'
    },
    type: {
      type: String,
      default: 'info' // warning/error/why
    },
    isShowCancelBtn: {
      type: Boolean,
      default: false
    },
    isShowConfirmBtn: {
      type: Boolean,
      default: true
    },
    isShowCloseBtn: {
      type: Boolean,
      default: true
    },
    // 将content解析为html
    isHtml: {
      type: Boolean,
      default: false
    },
    // 显示输入框
    isShowInput: {
      type: Boolean,
      default: false
    },
    // 不再提醒
    isChecked: {
      type: Boolean,
      default: false
    },
    confirmBtnDark: {
      type: Boolean,
      default: true
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    inputValue: [String, Number],
    inputTitle: {
      type: String,
      default: '标题'
    }
  },
  data () {
    return {
      align: 'center',
      isShowMessageBox: false,
      resolve: '',
      reject: '',
      checked: false,
    };
  },
  methods: {
    // 确定,将promise断定为resolve状态
    confirm: function (e) {
      e.stopPropagation()
      this.isShowMessageBox = false;
      if (this.isShowInput) {
        this.resolve(this.inputValue);
      } else if (this.isChecked) {
        this.resolve(this.checked);
      } else {
        this.resolve('confirm');
      }
      this.remove();
    },
    // 取消,将promise断定为reject状态
    cancel: function (e) {
      e.stopPropagation()
      this.isShowMessageBox = false;
      if (this.isChecked) {
        this.reject(this.checked);
      } else {
        this.reject('cancel');
      }
      this.remove();
    },
    // 弹出messageBox,并创建promise对象
    show: function () {
      this.isShowMessageBox = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    // 销毁
    remove: function () {
      setTimeout(() => {
        this.destroy();
      }, 300);
    },
    destroy: function () {
      this.$destroy();
      document.body.removeChild(this.$el);
    }
  },
  watch: {
    content (v) {
      if (v.length > 100) {
        this.align = 'flex-start'
      } else {
        this.align = 'center'
      }
    }
  },
};
</script>
<style lang="scss" scoped>

.wln-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 100001;
  .message-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 372px;
    max-width: 640px;
    min-height: 178px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 17px 0 rgba(0, 0, 0, 0.8);
  }
  .message-header {
    width: 100%;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    font-size: 14px;
    color: #000;
    padding: 0 11px 0 15px;
    font-weight: 400;
    background-color: #f4f4f4;
    box-sizing: border-box;
  }

  .icon-message-close {
    display: block;
    width: 20px;
    margin-top: 8px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    float: right;
    color: #8f8f8f;
    font-weight: bold;
    cursor: pointer;
    font-size: 12px !important;
  }
  .icon-message-close:hover {
    color: #000000;
  }

  .message-body {
    width: 100%;
    min-height: 90px;
    max-height: 200px;
    overflow: hidden;
    padding: 10px 20px 0;
    box-sizing: border-box;
  }
  .input-box {
    display: flex;
    width: 100%;
    // justify-content: center;
    align-items: center;
    > span {
      display: block;
    }
  }
  .message-body .icon-tips {
    font-size: 54px !important;
    text-align: center;
    width: 110px;
  }
  .message-btn-box {
    margin: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .message-btn {
    min-width: 50px;
    padding: 0 5px;
    margin: 0 3px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    color: #444b50;
    border: 1px solid #87959c;
    cursor: pointer;
  }
  .message-btn-success {
    color: #ffffff;
    border: 1px solid $primary-color;
    background-color: $primary-color;
    cursor: pointer;
    &:hover {
      color: #ffffff !important;
      border-color: $color-blue !important;
      background-color: $color-blue !important;
    }
  }

  .message-btn:hover {
    border-color: $primary-color;
    color: $primary-color;
  }

  .icon-close {
    font-size: 12px !important;
  }

  .icon-info {
    color: $icon-info-color;;
  }
  .icon-warning {
    color: $color-yellow;
  }
  .icon-error {
    color: $color-red;
  }
}
.check-box {
  margin-top: 10px;
}
</style>
