<template>
  <div class="car-info">
    <div
      v-for="(car, index) in form.cars"
      :key="index"
      ref="loop"
      class="container"
    >
      <a class="btn -delete" @click="deleteCarByIndex(index)"></a>
      <f-fieldset class="info">
        <template #legend> 車情報 {{ index + 1 }} </template>
        <f-text
          v-model="car.maker"
          v-vuelidate
          type="text"
          label="メーカー"
          placeholder="例：トヨタ"
        />
        <f-text
          v-model="car.model"
          v-vuelidate
          type="text"
          label="車種"
          placeholder="例：プリウス"
        />
        <f-text
          v-model="car.color"
          v-vuelidate
          class="_col-2"
          type="text"
          label="色"
          placeholder="例：青"
        />
        <f-fieldset class="info">
          <template #legend>サイズ</template>
          <f-text
            v-model="car.length"
            v-vuelidate
            class="_col-2"
            type="text"
            label="長さ"
            placeholder="5,000 mm"
          />
          <f-text
            v-model="car.width"
            v-vuelidate
            class="_col-2"
            type="text"
            label="幅"
            placeholder="5,000 mm"
          />
          <f-text
            v-model="car.height"
            v-vuelidate
            class="_col-2"
            type="text"
            label="高さ"
            placeholder="5,000 mm"
          />
          <f-text
            v-model="car.weight"
            v-vuelidate
            class="_col-2"
            label="重量"
            type="text"
            placeholder="5,000 kg"
          />
          <div class="car-preview -size">
            <div class="title">入力プレビュー</div>
            <div class="info">
              <div class="size -length">
                <span class="label">長さ：</span>
                <span class="value">{{
                  formatNum(car.length, ' mm') || '-'
                }}</span>
              </div>
              <div class="size -width">
                <span class="label">幅：</span>
                <span class="value">{{
                  formatNum(car.width, ' mm') || '-'
                }}</span>
              </div>
              <div class="size -height">
                <span class="label">高さ：</span>
                <span class="value">{{
                  formatNum(car.height, ' mm') || '-'
                }}</span>
              </div>
              <div class="size -weight">
                <span class="label">重量：</span>
                <span class="value">{{
                  formatNum(car.weight, ' kg') || '-'
                }}</span>
              </div>
            </div>
          </div>
        </f-fieldset>

        <f-fieldset class="info">
          <template #legend>ナンバープレート</template>
          <f-text
            v-model="car.number1"
            v-vuelidate
            class="_col-2"
            type="text"
            label="地域"
            placeholder="例：品川"
          />
          <f-text
            v-model="car.number2"
            v-vuelidate
            class="_col-2"
            type="text"
            label="分類番号"
            placeholder="例：123"
          />
          <f-text
            v-model="car.number3"
            v-vuelidate
            class="_col-2"
            type="text"
            label="ひらがな"
            placeholder="例：あ"
          />
          <f-text
            v-model="car.number4"
            v-vuelidate
            class="_col-2"
            type="text"
            label="一連番号"
            placeholder="例：1234"
          />
          <div class="car-preview -license">
            <div class="title">入力プレビュー</div>
            <div class="framed">
              <div class="area -number1">
                <span class="value">{{ car.number1 || '品川' }}</span>
              </div>
              <div class="area -number2">
                <span class="value">{{ car.number2 || '123' }}</span>
              </div>
              <br />
              <div class="area -number3">
                <span class="value">{{ car.number3 || 'あ' }}</span>
              </div>
              <div class="area -number4">
                <span class="value">{{
                  carNumber4(car.number4) || '12-34'
                }}</span>
              </div>
            </div>
          </div>
        </f-fieldset>
      </f-fieldset>
    </div>
    <div class="btn -add" @click="addCar()">車情報を追加する</div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { number } from '~/libs/validators'

export default {
  inject: ['getForm'],
  data() {
    return {
      form: this.getForm(this, {
        cars: [createEmptyCar()],
      }),
    }
  },
  methods: {
    formatNum(value, unit) {
      const yenFormatter = new Intl.NumberFormat('ja-JP')
      if (!value && value !== 0) return false
      const ret = yenFormatter.format(value)
      return ret === 'NaN' ? false : `${ret}${unit}`
    },
    carNumber4(value) {
      if (!value) return value
      switch (value.length) {
        case 1:
          return '- - - ' + value
        case 2:
          return '- - ' + value
        case 3:
          return '- ' + value.substr(0, 1) + ' ' + value.substr(1, 2)
        case 4:
          return value.substr(0, 2) + '-' + value.substr(2, 2)
      }
    },
    deleteCarByIndex(index) {
      this.form.cars.splice(index, 1)
    },
    addCar() {
      if (!this.form.cars) {
        this.form.cars = []
      }
      this.form.cars.push(createEmptyCar())
    },
  },
  validations: {
    form: {
      cars: {
        $each: {
          color: { required },
          maker: { required },
          model: { required },
          number1: { required },
          number2: { required },
          number3: { required },
          number4: { required },
          length: { required, number },
          width: { required, number },
          height: { required, number },
          weight: { required, number },
        },
      },
    },
  },
}

function createEmptyCar() {
  return {
    color: '',
    maker: '',
    model: '',
    number1: '',
    number2: '',
    number3: '',
    number4: '',
    length: '',
    width: '',
    height: '',
    weight: '',
  }
}
</script>

<style lang="scss" scoped>
.car-info {
  > .container {
    position: relative;
    margin-bottom: 16px;
    padding: 16px 16px 32px;
    border: 1px solid #ddd;
    border-radius: 3px;
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);
  }
  > .container > .btn.-delete {
    position: absolute;
    top: 24px;
    right: 16px;
    width: 14px;
    height: 14px;
    cursor: pointer;
    &::before,
    &::after {
      position: absolute;
      display: inline-block;
      content: '';
      width: 4px;
      height: 28px;
      border-radius: 3px;
      background: #222;
    }
    &::before {
      transform: translateY(-50%) rotate(45deg);
    }
    &::after {
      transform: translateY(-50%) rotate(-45deg);
    }
  }
  > .btn.-add {
    position: relative;
    display: block;
    width: 100%;
    max-width: 300px;
    margin: 24px auto 0;
    padding: 16px;
    background: #f6f6f6;
    border: 1px solid #ccc;
    border-radius: 28px;
    color: #454c50;
    cursor: pointer;
    text-align: center;
    &::before,
    &::after {
      position: absolute;
      top: 50%;
      left: 28px;
      transform: translateY(-50%);
      display: inline-block;
      content: '';
      width: 6px;
      height: 30px;
      border-radius: 3px;
      background: #607d8b;
    }
    &::after {
      transform: translateY(-50%) rotate(90deg);
    }
  }
}

.car-preview {
  width: 100%;
  > .title {
    margin: 8px 0 4px;
    font-weight: bold;
    font-size: 0.875rem;
    text-align: center;
  }
  &.-size {
    margin-bottom: 10px;
    > .info {
      display: flex;
      justify-content: center;
    }
    > .info > .size {
      width: 150px;
      margin: 0 3px;
    }
  }

  &.-license {
    > .framed {
      width: 160px;
      margin: 0 auto;
      padding: 8px;
      background: #00acbf;
      border-radius: 3px;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 14%);
      color: #fff;
      text-align: center;
      line-height: 1.2;
    }
    > .framed > .area {
      display: inline-block;
      border: 2px solid transparent;
      &.-number1 {
        min-width: 40px;
        font-size: 0.875rem;
        font-weight: bold;
        text-align: center;
      }
      &.-number2 {
        width: 35px;
        text-align: center;
      }
      &.-number3 {
        width: 20px;
        font-family: '游明朝体', 'Yu Mincho', YuMincho, 'ヒラギノ明朝 Pro',
          'Hiragino Mincho Pro', serif;
      }

      &.-number4 {
        width: 100px;
        font-size: 2rem;
        letter-spacing: 0.05rem;
        text-align: right;
      }
    }
  }
}
</style>
