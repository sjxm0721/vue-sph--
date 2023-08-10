<template>
  <div class="dd">
    <el-backtop></el-backtop>
    <div class="top-head">
      <h2 class="left-menu">活动查询</h2>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img
              :src="avatar + '?imageView2/1/w/80/h/80'"
              class="user-avatar"
            />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item>
              <span style="display: block" @click="changeUserInfo"
                >信息修改</span
              >
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display: block" @click="selectCollect"
                >我的收藏</span
              >
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="用户信息修改" :visible.sync="dialogFormVisible">
      <el-form
        style="width: 80%"
        :model="userInfo"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="用户昵称" label-width="100px" prop="userName">
          <el-input autocomplete="off" v-model="userInfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" label-width="100px" prop="avatar">
          <el-upload
            name="avatar"
            class="avatar-uploader"
            action="/myPHP/getAvatar.php"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="我的收藏" :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="collectActivity">
        <el-table-column
          property="activityName"
          label="活动名"
          width="200"
        ></el-table-column>
        <el-table-column
          property="location"
          label="活动地点"
        ></el-table-column>
        <el-table-column property="startTime" label="活动时间" width="200"></el-table-column>
      <el-table-column property="value1" label="开展形式"></el-table-column>
      <el-table-column property="value2" label="活动级别"></el-table-column>
      <el-table-column property="value3" label="活动种类" width="200"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="{row,$index}">
            <el-button type="success" icon="el-icon-connection" title="前往链接" @click="toUrl(row.url)" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" title="移出收藏" size="mini" @click="deleteCollection(row.activityId)"></el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-dialog>

    <div class="body">
      <div class="content">
        <div class="clearfix">
          <div class="left">
            <el-input
              placeholder="请输入活动名"
              v-model="input"
              class="input-with-select"
              style="width: 500px"
            >
            </el-input>
            <el-button slot="append" type="primary" @click="searchContent"
              >查询</el-button
            >
            <el-button
              slot="append"
              style="margin-left: 0"
              @click="handleClickRe"
              >重置</el-button
            >
          </div>
          <div class="right">
            <el-date-picker
              v-model="value"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTime"
            >
              >
            </el-date-picker>
          </div>
        </div>

        <div class="selected">
          <span>已选条件：</span>
          <el-tag
            v-show="organization != ''"
            closable
            type=""
            effect="dark"
            style="margin-left: 20px"
            @close="closeOf"
          >
            {{ organization.split(":")[1] }}
          </el-tag>
          <el-tag
            v-show="level != ''"
            closable
            type=""
            effect="dark"
            style="margin-left: 20px"
            @close="closeLevel"
          >
            {{ level.split(":")[1] }}
          </el-tag>
          <el-tag
            v-show="category != ''"
            closable
            type=""
            effect="dark"
            style="margin-left: 20px"
            @close="closeCategory"
          >
            {{ category.split(":")[1] }}
          </el-tag>
        </div>
        <div class="tagToChoose">
          <transition name="sort">
            <form v-show="show">
              <fieldset>
                <legend>开展形式：</legend>
                <label
                  v-for="(organizationf, index) in organizationAttrData"
                  :key="organizationf.id"
                >
                  <input
                    type="radio"
                    name="organization"
                    :value="`${organizationf.id}:${organizationf.value}`"
                    v-model="organization"
                  />
                  {{ organizationf.value }}
                </label>
              </fieldset>

              <fieldset>
                <legend>活动级别：</legend>
                <label
                  v-for="(levelf, index) in levelAttrData"
                  :key="levelf.id"
                >
                  <input
                    type="radio"
                    name="level"
                    :value="`${levelf.id}:${levelf.value}`"
                    v-model="level"
                  />
                  {{ levelf.value }}</label
                >
              </fieldset>

              <fieldset>
                <legend>活动种类：</legend>
                <label
                  v-for="(categoryf, index) in categoryAttrData"
                  :key="categoryf.id"
                >
                  <input
                    type="radio"
                    name="category"
                    :value="`${categoryf.id}:${categoryf.value}`"
                    v-model="category"
                  />
                  {{ categoryf.value }}
                </label>
                <!-- <input id="se" class="se" type="radio" /> -->
              </fieldset>
            </form>
          </transition>

          <div class="retract">
            <p v-if="show == true">
              <span
                ><svg
                  t="1685704255417"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3269"
                  width="16"
                  height="16"
                >
                  <path
                    d="M752.64 376.32 546.56 202.88c-19.2-16-50.56-16-69.76 0L270.72 376.32C240 402.56 261.76 447.36 305.28 447.36L384 447.36C384 447.36 384 448 384 448l0 320c0 35.2 28.8 64 64 64l128 0c35.2 0 64-28.8 64-64L640 448c0 0 0-0.64 0-0.64l78.08 0C761.6 447.36 783.36 402.56 752.64 376.32z"
                    p-id="3270"
                  ></path></svg
              ></span>

              <span><a @click="show = !show">收起</a></span>
            </p>
            <p v-else>
              <span
                ><svg
                  t="1685705128792"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4783"
                  width="16"
                  height="16"
                >
                  <path
                    d="M719.36 575.36l-77.44 0c0-0.64 0-0.64 0-1.28L641.92 256c0-35.2-28.8-64-64-64L448 192C412.8 192 384 220.8 384 256l0 318.08c0 0.64 0 0.64 0 1.28L305.92 575.36c-44.16 0-65.92 44.8-35.2 70.4l206.72 173.44c19.2 16 50.56 16 69.76 0l206.72-173.44C785.28 620.16 763.52 575.36 719.36 575.36z"
                    p-id="4784"
                  ></path></svg
              ></span>

              <span><a @click="show = !show">展开</a></span>
            </p>
          </div>
        </div>
        <div class="activity-show">
          <div class="show-top">
            <div class="show-top-radio">
              <el-radio v-model="radio" label="1">默认顺序</el-radio>
              <el-radio v-model="radio" label="2">点赞数</el-radio>
              <el-radio v-model="radio" label="3">收藏数</el-radio>
            </div>
          </div>
          <div class="show-main">
            <div>
              <!-- v-model="activeNames" @change="handleChange" -->
              <el-collapse>
                <!-- title="一致性 Consistency" name="1" -->
                <el-collapse-item
                  v-for="(activity, index) in totalActivity"
                  :key="activity.activityId"
                  class="collapse"
                >
                  <template slot="title">
                    <div
                      :style="itemStyles[index]"
                      style="
                        margin-left: 20px;
                        margin-right: 20px;
                        width: 100%;
                        color: rgba(0, 0, 0, 1);
                      "
                    >
                      <div class="content-clearfix">
                        <div class="content-left">
                          {{ activity.activityName }}
                        </div>
                        <div class="content-time">
                          {{ activity.startTime }}
                        </div>
                        <div class="content-right">
                          <span @click.prevent="toUrl(activity.url)">
                            <svg
                              t="1685773724156"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="2404"
                              width="32"
                              height="32"
                            >
                              <path
                                d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
                                fill="#5D5D5D"
                                p-id="2405"
                              ></path>
                              <path
                                d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
                                fill="#5D5D5D"
                                p-id="2406"
                              ></path>
                            </svg>
                          </span>
                          <span
                            @click.prevent="likeButton(activity.activityId)"
                          >
                            <svg
                              t="1685773912550"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="7317"
                              width="32"
                              height="32"
                            >
                              <path
                                d="M190.193225 471.411583c14.446014 0 26.139334-11.718903 26.139334-26.13831 0-14.44499-11.69332-26.164916-26.139334-26.164916-0.271176 0-0.490164 0.149403-0.73678 0.149403l-62.496379 0.146333c-1.425466-0.195451-2.90005-0.295735-4.373611-0.295735-19.677155 0-35.621289 16.141632-35.621289 36.114522L86.622358 888.550075c0 19.949354 15.96767 35.597753 35.670407 35.597753 1.916653 0 3.808746 0.292666 5.649674 0l61.022819 0.022513c0.099261 0 0.148379 0.048095 0.24764 0.048095 0.097214 0 0.146333-0.048095 0.24457-0.048095l0.73678 0 0-0.148379c13.413498-0.540306 24.174586-11.422144 24.174586-24.960485 0-13.55983-10.760065-24.441669-24.174586-24.981974l0-0.393973-50.949392 0 1.450025-402.275993L190.193225 471.409536z"
                                fill="#5D5D5D"
                                p-id="7318"
                              ></path>
                              <path
                                d="M926.52241 433.948343c-19.283182-31.445176-47.339168-44.172035-81.289398-45.546336-1.77032-0.246617-3.536546-0.39295-5.380544-0.39295l-205.447139-0.688685c13.462616-39.059598 22.698978-85.58933 22.698978-129.317251 0-28.349675-3.193739-55.962569-9.041934-82.542948l-0.490164 0.049119c-10.638291-46.578852-51.736315-81.31498-100.966553-81.31498-57.264215 0-95.466282 48.15065-95.466282 106.126063 0 3.241834-0.294712 6.387477 0 9.532097-2.996241 108.386546-91.240027 195.548698-196.23636 207.513194l0 54.881958-0.785899 222.227314 0 229.744521 10.709923 0 500.025271 0.222057 8.746198-0.243547c19.35686 0.049119 30.239721-4.817726 47.803749-16.116049 16.682961-10.761088 29.236881-25.50079 37.490869-42.156122 2.260483-3.341095 4.028757-7.075139 5.106298-11.20111l77.018118-344.324116c1.056052-4.053316 1.348718-8.181333 1.056052-12.160971C943.643346 476.446249 938.781618 453.944769 926.52241 433.948343zM893.82573 486.837924l-82.983993 367.783411-0.099261-0.049119c-2.555196 6.141884-6.879688 11.596106-12.872169 15.427364-4.177136 2.727111-8.773827 4.351098-13.414521 4.964058-1.49812-0.195451-3.046383 0-4.620227 0l-477.028511-0.540306-0.171915-407.408897c89.323375-40.266076 154.841577-79.670527 188.596356-173.661202 0.072655 0.024559 0.124843 0.049119 0.195451 0.072655 2.99931-9.137101 6.313799-20.73423 8.697079-33.164331 5.551436-29.185716 5.258771-58.123792 5.258771-58.123792-4.937452-37.98001 25.940812-52.965306 44.364417-52.965306 25.304316 0.860601 50.263777 33.656541 50.263777 52.326762 0 0 5.600555 27.563776 5.649674 57.190537 0.048095 37.366026-4.6673 56.847729-4.6673 56.847729l-0.466628 0c-5.872754 30.879288-16.214287 60.138682-30.464849 86.964654l0.36839 0.342808c-2.358721 4.815679-3.709485 10.220782-3.709485 15.943111 0 19.922748 19.088754 21.742187 38.765909 21.742187l238.761895 0.270153c0 0 14.666024 0.465604 14.690584 0.465604l0 0.100284c12.132318-0.638543 24.221658 5.207605 31.100322 16.409738 5.504364 9.016351 6.437619 19.6045 3.486404 28.988218L893.82573 486.837924z"
                                fill="#5D5D5D"
                                p-id="7319"
                              ></path>
                              <path
                                d="M264.827039 924.31872c0.319272 0.024559 0.441045 0.024559 0.295735-0.024559 0.243547-0.048095 0.367367-0.074701-0.295735-0.074701s-0.539282 0.026606-0.271176 0.074701C264.43409 924.343279 264.532327 924.343279 264.827039 924.31872z"
                                fill="#5D5D5D"
                                p-id="7320"
                              ></path>
                            </svg>
                          </span>
                          <span
                            @click.prevent="collectButton(activity.activityId)"
                          >
                            <svg
                              t="1685773859502"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="5385"
                              width="32"
                              height="32"
                            >
                              <path
                                d="M512 776.533333l-238.933333 85.333334 8.533333-251.733334L128 405.333333l243.2-72.533333L512 128l140.8 209.066667L896 405.333333l-153.6 200.533334 8.533333 251.733333-238.933333-81.066667z m0-93.866666l149.333333 51.2-4.266666-157.866667 98.133333-123.733333-153.6-42.666667L512 277.333333 422.4 409.6l-153.6 42.666667 98.133333 123.733333-4.266666 157.866667L512 682.666667z"
                                fill="#444444"
                                p-id="5386"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div
                    :style="itemStyles[index]"
                    style="
                      margin-left: 20px;
                      margin-right: 40px;
                      height: 100%;
                      margin-top: 5px;
                      color: rgba(0, 0, 0, 1);
                    "
                  >
                    <div class="clearfix" style="margin: 20px">
                      <div v-show="activity.location">
                        <div class="title">活动地点</div>
                        <div class="con1">{{ activity.location }}</div>
                      </div>
                      <div v-show="activity.id">
                        <div class="title">开展形式</div>
                        <div class="clearfix-tag">
                          <el-tag type="success" effect="dark">
                            {{ activity.value1 }}
                          </el-tag>
                        </div>
                      </div>
                      <div v-show="activity.id1">
                        <div class="title">活动级别</div>
                        <div class="clearfix-tag">
                          <el-tag type="success" effect="dark">
                            {{ activity.value2 }}
                          </el-tag>
                        </div>
                      </div>
                      <div v-show="activity.id2">
                        <div class="title">活动种类</div>
                        <div class="clearfix-tag">
                          <el-tag type="success" effect="dark">
                            {{ activity.value3 }}
                          </el-tag>
                        </div>
                      </div>
                      <div v-show="activity.likeNum">
                        <div class="title">点赞</div>
                        <div class="con2">{{ activity.likeNum }}</div>
                      </div>
                      <div v-show="activity.collectNum">
                        <div class="title">收藏</div>
                        <div class="con2">{{ activity.collectNum }}</div>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle.js";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
export default {
  name: "Activity",
  data() {
    return {
      input: "", //用户查询输入
      value: null, //用户选择的时间段
      show: true,
      colors: [
        "#dddfd4",
        "#fae596",
        "#3fb0ac",
        "#173e43",
        "#bccbde",
        "#c2dde6",
        "#e6e9f0",
        "#431c5d",
        "#e05915",
        "#cdd422",
      ],
      itemStyles: [],
      organization: "",
      level: "",
      category: "",
      radio: "1",
      dialogFormVisible: false,
      dialogTableVisible: false,
      userInfo: {
        avatar: "",
        userName: "",
        userId: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
        avatar: [{ required: false, message: "请选择头像" }],
      },
      //收藏的活动
      collectActivity:[],
    };
  },
  computed: {
    ...mapState("specific", ["totalActivity"]),
    ...mapState("category", [
      "organizationAttrData",
      "levelAttrData",
      "categoryAttrData",
    ]),
    ...mapState("user", ["collectionList"]),
    ...mapGetters(["avatar", "userName", "name"]),
  },
  methods: {
    getTotalActivity() {
      this.$store.dispatch("specific/getTotalActivity");
    },
    getRandomColor() {
      const randomIndex = Math.floor(Math.random() * this.colors.length);
      return `rgba(${parseInt(
        this.colors[randomIndex].substring(1, 3),
        16
      )},${parseInt(this.colors[randomIndex].substring(3, 5), 16)},${parseInt(
        this.colors[randomIndex].substring(5, 7),
        16
      )},0.5)`;
    },
    generateRandomStyle() {
      this.itemStyles = this.totalActivity.map(() => ({
        fontSize: "15px",
        borderRadius: "5px",
        background: this.getRandomColor(),
        fontWeight: "bold",
      }));
    },
    getUserActivity() {
      let tmp = {
        input: this.input,
        startTime: this.value != null ? this.value[0] : "",
        endTime: this.value != null ? this.value[1] : "",
        radio: this.radio,
        organization:
          this.organization != "" ? this.organization.split(":")[0] : "",
        level: this.level != "" ? this.level.split(":")[0] : "",
        category: this.category != "" ? this.category.split(":")[0] : "",
      };
      this.$store.dispatch("specific/getUserActivity", tmp);
    },
    getChildrenAttrData() {
      this.$store.dispatch("category/getOrganizationAttrData");
      this.$store.dispatch("category/getLevelAttrData");
      this.$store.dispatch("category/getCategoryAttrData");
    },
    //获取用户信息
    async getInfo() {
      try {
        await this.$store.dispatch("user/getInfo");
      } catch (error) {
        this.$message({ type: "error", message: "获取用户信息失败" });
        this.logout();
      }
    },
    //获取收藏列表
    getCollection(){
      this.$store.dispatch("user/selectCollection", this.name);
    },
    //搜索按钮的回调
    searchContent() {
      this.getUserActivity();
    },
    //重置按钮回调
    handleClickRe() {
      this.input = "";
      this.getUserActivity();
    },
    //关闭of tag的回调
    closeOf() {
      this.organization = "";
    },
    //关闭level tag的回调
    closeLevel() {
      this.level = "";
    },
    //关闭category tag的回调
    closeCategory() {
      this.category = "";
    },
    changeTime() {
      if (this.value == null) {
        this.getUserActivity();
      }
    },
    toUrl(url) {
      event.stopPropagation();
      window.open(url, "__blank");
    },

    logout() {
      removeToken(); // must remove  token  first
      resetRouter();
      this.$store.commit("user/RESET_STATE");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },

    changeUserInfo() {
      this.getInfo();
      this.userInfo = {
        avatar: this.avatar,
        userName: this.userName,
        userId: this.name,
      };
      this.dialogFormVisible = true;
    },

    //上传图片相关的回调
    handleAvatarSuccess(res, file) {
      //图片上传成功
      this.userInfo.avatar = res.data.avatar;
    },
    beforeAvatarUpload(file) {
      //图片上传之前
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    updateUserInfo() {
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;
          //发请求
          let result = this.$store.dispatch(
            "user/updateUserInfo",
            this.userInfo
          );
          result
            .then(() => {
              this.$message({
                message: "修改个人信息成功",
                type: "success",
              });
              this.getInfo();
            })
            .catch(() => {
              this.$message({
                message: "修改个人信息失败",
                type: "success",
              });
            });
        } else {
          alert("error submit!");
          return false;
        }
      });
    },
    cancelUpdate() {
      this.dialogFormVisible = false;
      this.userInfo = {
        userName: "",
        avatar: "",
      };
    },
    //用户点击点赞按钮的回调
    likeButton(activityId) {
      event.stopPropagation();
      this.like(activityId);
    },
    like: throttle(function (activityId) {
      let result = this.$store.dispatch("specific/addClickNum", activityId);
      result
        .then(() => {
          this.$message({ type: "success", message: "点赞成功" });
          this.getUserActivity();
        })
        .catch(() => {
          this.$message({ type: "error", message: "点赞失败" });
        });
    }, 5000),
    //用户点击收藏按钮的回调
    collectButton(activityId) {
      event.stopPropagation();
      this.collect(activityId);
    },
    collect: throttle(function (activityId) {
      let data = {
        activityId: activityId,
        userId: this.name,
      };
      let result = this.$store.dispatch("specific/collectActivity", data);
      result
        .then(() => {
          this.$message({ type: "success", message: "收藏成功" });
          this.getUserActivity();
        })
        .catch(() => {
          this.$message({ type: "error", message: "已经在收藏中" });
        });
    }, 5000),
    //查看我的收藏
    selectCollect() {
      this.getCollection();
      this.dialogTableVisible=true;
    },
    deleteCollection(activityId){
      let tmp={
        userId:this.name,
        activityId:activityId
      }
      let result=this.$store.dispatch('user/deleteCollection',tmp);
      result.then(()=>{
        this.$message({type:'success',message:'移出收藏成功'});
        this.getUserActivity();
        this.getCollection();
      }).catch(()=>{
        this.$message({type:'error',message:"移出收藏失败"});
      })
    }
  },
  mounted() {
    this.getTotalActivity();
    this.getChildrenAttrData();
    this.generateRandomStyle();
  },
  watch: {
    totalActivity: {
      deep: true,
      handler(newValue, oldValue) {
        this.generateRandomStyle(); //生成颜色样式
      },
    },
    value: {
      deep: true,
      handler(newValue, oldValue) {
        this.getUserActivity();
      },
    },
    radio(newValue, oldValue) {
      this.getUserActivity();
    },
    organization(newValue, oldValue) {
      this.getUserActivity();
    },
    level(newValue, oldValue) {
      this.getUserActivity();
    },
    category(newValue, oldValue) {
      this.getUserActivity();
    },
    collectionList:{
      deep:true,
      immediate:true,
      handler(newValue,oldValue){
        this.collectActivity=this.totalActivity.filter(item1=>{
          return this.collectionList.some(item2=>{
            return item1.activityId===item2.activityId;
          })
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.dd {
  flex: 1;
}
.top-head {
  padding: 1px;
  background-color: #0483d4;
  color: #fff;
  position: relative;
}

.top-head::before,
.top-head::after {
  content: "";
  display: block;
}

.top-head::after {
  clear: both;
}

.left-menu {
  position: absolute;
  left: 50px;
}

.body {
  padding: 15px;
}

.body .content {
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
}

.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.clearfix .right {
  position: absolute;
  right: 0;
}

.selected {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  background-image: linear-gradient(to bottom, #fff, #eaf3fc);
  padding: 10px;
  border: 1px solid #a7bdd3;
  /* border-radius: 10px; */
}

.selected > span {
  padding: 5px;
  margin-right: 5px;
  display: flex;
  align-items: center;
}

.selected > span > a {
  margin-left: 5px;
  color: red;
  cursor: pointer;
}

.tagToChoose {
  border: 1px solid #a7bdd3;
  border-bottom: 0px;
}

.tagToChoose legend {
  font-weight: bold;
  font-size: 20px;
}

.tagToChoose label {
  color: #0792d6;
  font-size: 18px;
}

.tagToChoose fieldset {
  margin: 20px 10px;
}

.tagToChoose fieldset:hover {
  background-color: #f0f0f0;
}

.tagToChoose label:hover {
  color: #ff8046;
  font-size: 20px;
}

.retract {
  margin-top: 2px;
  text-align: center;
  display: block;
  clear: both;
  background: url(~@/assets/more--item_bg1.gif) repeat-x left bottom;
}
.retract P {
  background: url(~@/assets/more--item_btn1.gif) repeat-x left top;
  height: 24px;
  line-height: 24px;
  width: 92px;
  display: block !important;
  margin: 0 auto;
}
.retract a {
  padding-left: 4px;
}

.se {
  display: none;
}

.se:checked ~ .se {
  display: block;
}
.sort-enter,
.sort-leave-to {
  height: 0px;
}
.sort-enter-to,
.sort-leave {
  height: 224px;
}
.sort-enter-active,
.sort-leave-active {
  transition: all 0.3s linear;
  overflow: hidden;
}

.activity-show {
  border: 1px solid #a7bdd3;
  border-radius: 5px;
  margin: 20px 0px;
}

.activity-show .show-top {
  position: relative;
  background-color: #d9edf7;
  height: 30px;
  border-radius: 5px;
}

.show-top-radio {
  position: absolute;
  right: 0;
  margin: 5px;
}

.collapse {
  margin: 15px;
}

.content-clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.content-right {
  position: absolute;
  right: 10px;
}

.content-time {
  position: absolute;
  right: 200px;
}

.con1 {
  font-size: 25px;
  padding: 3px;
  color: #f00;
  background-color: rgba(125, 125, 125, 0.3);
  border-radius: 5px;
}

.con2 {
  font-size: 25px;
  padding: 3px;
}

.clearfix-tag {
  margin: 15px 0;
}
.content-right span {
  display: inline-block;
  padding: 2px;
  margin: 3px;
  /*margin-top: 20px;*/
  background-color: rgba(125, 125, 125, 0.1);
  border-radius: 50%;
  text-align: center;
  width: 40px;
  height: 40px;
}

.content-right span :hover {
  background-color: rgba(125, 125, 125, 0.8);
  border-radius: 50%;
  width: 35px;
  height: 35px;
}

.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;

  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 50px;

    .avatar-wrapper {
      margin-top: 15px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
