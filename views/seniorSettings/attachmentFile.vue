<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <upload-file
          @onUploadFileDetail="onUploadFileDetail"
          :fileAccept="fileAccept"
        />
      </el-col>
    </el-row>
    <el-tabs v-model="tabsActiveName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="铃声" name="ring"> </el-tab-pane>
      <el-tab-pane label="广播音频" name="multicast"> </el-tab-pane>
    </el-tabs>
    <el-table
      ref="tables"
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="left" prop="name" />
      <el-table-column
        label="文件大小"
        align="center"
        prop="size"
        :formatter="fileSizeFormat"
      />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="downloadFile(scope.row)"
            >下载</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-play"
            @click="onPlayOnline(scope.row)"
            >播放</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 播放文件 -->
    <div style="width: 100%">
      <div v-if="playFile.show" id="aplayer"></div>
    </div>
  </div>
</template>

<script>
import {
  listAttachment,
  updateAttachment,
} from "@masterModule/api/attachment/attachment";
import downloadHelper from "@maintainModule/api/maintain/downloadHelper";
import uploadFile from "@maintainModule/components/uploadFile";
import APlayer from "aplayer"; // 引入音乐插件
import "aplayer/dist/APlayer.min.css"; // 引入音乐插件的样式
import { fileBytesToSize } from "@/utils/ruoyi";
/**
 * 文件的用途：铃声
 */
const FILE_USE_RING = "1";

/**
 * 文件的用途名称：铃声
 */
const FILE_USE_NAME_RING = "ring";
/**
 * 文件的用途：广播
 */
const FILE_USE_MULTICAST = "0";

/**
 * 文件的用途名称：广播
 */
const FILE_USE_NAME_MULTICAST = "multicast";
export default {
  name: "attachmentFile",
  components: {
    uploadFile,
    APlayer,
  },
  data() {
    return {
      // 播放文件
      playFile: {
        // 文件名称
        name: "",
        // 文件播放路径
        url: "",
        // 是否显示
        show: true,
        cover: require("@/assets/logo/logo.png"),
        artist: "广播音频",
      },
      //下一个将要播放的文件
      nextPlayFile: null,
      //播放器配置信息
      playerInfo: {
        fixed: false, // 不开启吸底模式
        listFolded: true, // 折叠歌曲列表
        autoplay: true, // 开启自动播放
        preload: "auto", // 自动预加载歌曲
        loop: "all", // 播放循环模式、all全部循环 one单曲循环 none只播放一次
        order: "list", //  播放模式，list列表播放, random随机播放
      },
      //播放器
      ap: null,
      // 只接收mp3类型的文件
      fileAccept: "*.mp3",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: "operTime", order: "descending" },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        use: FILE_USE_RING,
      },

      //活动tab
      tabsActiveName: FILE_USE_NAME_RING,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      if (this.tabsActiveName === FILE_USE_NAME_RING) {
        this.queryParams.use = FILE_USE_RING;
      } else if (this.tabsActiveName === FILE_USE_NAME_MULTICAST) {
        this.queryParams.use = FILE_USE_MULTICAST;
      }
      listAttachment(
        this.queryParams.pageNum,
        this.queryParams.pageSize,
        this.queryParams.use
      ).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.list = res.data.list;
        } else {
          this.msgError(res.msg);
        }
      });
      this.loading = false;
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.operId);
      this.multiple = !selection.length;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },

    downloadFile(row) {
      var downloadName =
        row.name + row.path.substring(row.path.lastIndexOf("."));
      var fileList = [];
      fileList.push(row.path);
      this.$modal.loading("数据下载中...");
      downloadHelper.startDownload(
        fileList,
        "media",
        "audio",
        downloadName,
        this.downloadFinished,
        false
      );
    },
    downloadFinished() {
      this.$modal.closeLoading();
    },
    //上传成功回调
    onUploadFileDetail(res) {
      if (res.code == 200) {
        let use = FILE_USE_RING;
        if (this.tabsActiveName === FILE_USE_NAME_RING) {
          use = FILE_USE_RING;
        } else if (this.tabsActiveName === FILE_USE_NAME_MULTICAST) {
          use = FILE_USE_MULTICAST;
        }
        let attachment = {
          use: use,
          path: res.data.filePath,
          name: res.data.fileName,
          size: res.data.length,
          type: res.data.filePath.substring(
            res.data.filePath.lastIndexOf(".") + 1
          ),
        };
        updateAttachment(attachment).then((response) => {
          this.getList();
        });
      }
    },
    /**
     * 在线播放
     */
    onPlayOnline(row) {
      this.nextPlayFile = row;
      var fileList = [];
      fileList.push(row.path);
      downloadHelper.startDownload(
        fileList,
        "media",
        "audio",
        null,
        this.OnPlayReady,
        false,
        null,
        true
      );
    },
    /**
     * 下载完成，可以开始播放了
     */
    OnPlayReady(url) {
      this.playFile.name = this.nextPlayFile.name;
      this.playFile.url = url;
      this.show = true;
      this.initAudio();
    },
    initAudio() {
      // 创建一个音乐播放器实例，并挂载到DOM上，同时进行相关配置
      if (!this.ap) {
        this.ap = new APlayer({
          container: document.getElementById("aplayer"),
          audio: this.playFile, // 音乐信息
          ...this.info, // 其他配置信息
        });
        this.ap.play();
      } else {
        this.ap.list.clear();
        this.ap.list.add(this.playFile);
        this.ap.play();
      }
    },

    fileSizeFormat(row) {
      return fileBytesToSize(parseInt(row.size));
    },
    handleTabClick() {
      this.getList();
    },
  },
};
</script>

