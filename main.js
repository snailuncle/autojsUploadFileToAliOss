/**
 * @作者 家
 * @QQ 203118908
 * @功能 阿里云oss文件上传
 * @参考链接1 -OSS权限相关常见错误的排查方法 https://help.aliyun.com/document_detail/42777.html?spm=a2c4g.11186623.2.12.5c377f36aD9Y95
 * @参考链接2 -快速搭建移动应用直传服务 https://help.aliyun.com/document_detail/31920.html
 * @参考链接3 -权限控制 https://help.aliyun.com/document_detail/31921.html?spm=a2c4g.11186623.2.27.65f74947gXnVGL#concept-i1m-lvx-5db
 * @参考链接4 -记一次阿里云OSS的STS授权访问 https://www.cnblogs.com/ou11/p/10133217.html
 * @权限 进入阿里云oss界面-> 左侧概览-> 右侧安全令牌-> 前往ram控制台-> 开始授权-> 然后你就会得到 ak, sk, RoleArn, 将这三个放到sts服务器config中
 * @STS服务器SDK下载 https://help.aliyun.com/document_detail/31920.html
 */

let config = require('./config')

// let jarFilePath = config.jarFilePath
// log(files.exists(jarFilePath));
// runtime.loadJar(jarFilePath);

let dexFilePath = config.dexFilePath
log(files.exists(dexFilePath));
runtime.loadDex(dexFilePath);

importClass("com.alibaba.sdk.android.oss.model.ObjectMetadata");
importClass("com.alibaba.sdk.android.oss.common.auth.OSSAuthCredentialsProvider");
importClass("com.alibaba.sdk.android.oss.ClientConfiguration");
importClass("android.content.Context");
importClass("android.graphics.Bitmap");
importClass("android.util.Log");
importClass("com.alibaba.oss.app.Config");
importClass("com.alibaba.oss.app.view.UIDisplayer");
importClass("com.alibaba.sdk.android.oss.ClientException");
importClass("com.alibaba.sdk.android.oss.OSS");
importClass("com.alibaba.sdk.android.oss.OSSClient");
importClass("com.alibaba.sdk.android.oss.ServiceException");
importClass("com.alibaba.sdk.android.oss.callback.OSSCompletedCallback");
importClass("com.alibaba.sdk.android.oss.callback.OSSProgressCallback");
importClass("com.alibaba.sdk.android.oss.common.OSSLog");
importClass("com.alibaba.sdk.android.oss.common.auth.OSSCustomSignerCredentialProvider");
importClass("com.alibaba.sdk.android.oss.common.auth.OSSPlainTextAKSKCredentialProvider");
importClass("com.alibaba.sdk.android.oss.common.utils.OSSUtils");
importClass("com.alibaba.sdk.android.oss.internal.OSSAsyncTask");
importClass("com.alibaba.sdk.android.oss.model.CompleteMultipartUploadResult");
importClass("com.alibaba.sdk.android.oss.model.CreateBucketRequest");
importClass("com.alibaba.sdk.android.oss.model.DeleteBucketRequest");
importClass("com.alibaba.sdk.android.oss.model.DeleteBucketResult");
importClass("com.alibaba.sdk.android.oss.model.DeleteObjectRequest");
importClass("com.alibaba.sdk.android.oss.model.GetObjectRequest");
importClass("com.alibaba.sdk.android.oss.model.GetObjectResult");
importClass("com.alibaba.sdk.android.oss.model.HeadObjectRequest");
importClass("com.alibaba.sdk.android.oss.model.HeadObjectResult");
importClass("com.alibaba.sdk.android.oss.model.ImagePersistRequest");
importClass("com.alibaba.sdk.android.oss.model.ImagePersistResult");
importClass("com.alibaba.sdk.android.oss.model.ListObjectsRequest");
importClass("com.alibaba.sdk.android.oss.model.ListObjectsResult");
importClass("com.alibaba.sdk.android.oss.model.MultipartUploadRequest");
importClass("com.alibaba.sdk.android.oss.model.OSSRequest");
importClass("com.alibaba.sdk.android.oss.model.PutObjectRequest");
importClass("com.alibaba.sdk.android.oss.model.PutObjectResult");
importClass("com.alibaba.sdk.android.oss.model.ResumableUploadRequest");
importClass("com.alibaba.sdk.android.oss.model.ResumableUploadResult");
importClass("com.alibaba.sdk.android.oss.model.TriggerCallbackRequest");
importClass("com.alibaba.sdk.android.oss.model.TriggerCallbackResult");
importClass("java.io.File");
importClass("java.io.IOException");
importClass("java.io.InputStream");
importClass("java.util.HashMap");
importClass("java.util.Map");
// importClass("okhttp3.OkHttpClient");
importClass("okhttp3.Request");
importClass("okhttp3.Response");
importClass("java.lang.System");

// STS 鉴权服务器地址，使用前请参照文档 https://help.aliyun.com/document_detail/31920.html 介绍配置STS 鉴权服务器地址。
// 或者根据工程sts_local_server目录中本地鉴权服务脚本代码启动本地STS 鉴权服务器。详情参见sts_local_server 中的脚本内容。
//  STS_SERVER_URL = "http://*.*.*.*:*/sts/getsts";//STS 地址   http://localhost:3000/
STS_SERVER_URL = config.STS_SERVER_URL; //STS 地址   http://localhost:3000/
credentialProvider = new OSSAuthCredentialsProvider(STS_SERVER_URL);
log(credentialProvider);

conf = new ClientConfiguration();
conf.setConnectionTimeout(15 * 1000); // 连接超时，默认15秒
conf.setSocketTimeout(15 * 1000); // socket超时，默认15秒
conf.setMaxConcurrentRequest(5); // 最大并发请求书，默认5个
conf.setMaxErrorRetry(2); // 失败后最大重试次数，默认2次

endpoint = config.endpoint;
mOss = new OSSClient(context, endpoint, credentialProvider, conf);
mBucket = config.mBucket;
displayer = config.displayer;
object = config.object;
localFile = config.localFile

asyncPutImage(object, localFile);

// String object, String localFile
function asyncPutImage (object, localFile) {
  upload_start = System.currentTimeMillis();
  log("upload start");
  file = new File(localFile);
  // 构造上传请求
  log("create PutObjectRequest ");
  log("mBucket = " + mBucket);
  log("object = " + object);
  log("localFile = " + localFile);
  put = new PutObjectRequest(mBucket, object, localFile);
  // put.setCRC64(OSSRequest.CRC64Config.YES);
  client = mOss;
  // 开始同步上传
  result = client.putObject(put);
  log("upload: result=" + result);
  // 得到一个外网可访问的地址
  url = client.presignPublicObjectURL(mBucket, object);
  // 格式打印输出
  log(java.lang.String.format("PublicObjectURL:%s", url));
  log('上传完毕')
  sleep(1000);
  exit();

  // 异步上传时可以设置进度回调
  put.setProgressCallback(
    new OSSProgressCallback({
      onProgress: function (request, currentSize, totalSize) {
        log("PutObject", "currentSize: " + currentSize + " totalSize: " + totalSize);
        progress = (100 * currentSize) / totalSize;
        log("上传进度: " + java.lang.String.valueOf(progress) + "%");
      }
    })
  );

  metadata = new ObjectMetadata();
  userMetadata = new HashMap();
  userMetadata.put("userVar1", "value");
  metadata.addUserMetadata("X-Oss-meta-Key2", "Value2");
  // Content-Disposition
  metadata.setContentDisposition("attachment;filename=" + localFile);
  metadata.setServerSideEncryption(ObjectMetadata.AES_256_SERVER_SIDE_ENCRYPTION);
  metadata.setCacheControl("no-cache");
  metadata.setContentEncoding("gzip");
  metadata.setUserMetadata(userMetadata);
  put.setMetadata(metadata);

  log("asyncPutObject ");
  task = mOss.asyncPutObject(
    put,
    new OSSCompletedCallback({
      onSuccess: function (request, result) {
        log("PutObject", "UploadSuccess");

        log("ETag", result.getETag());
        log("RequestId", result.getRequestId());

        upload_end = System.currentTimeMillis();
        log("upload cost: " + (upload_end - upload_start) / 1000);
        mDisplayer.uploadComplete();
        mDisplayer.displayInfo(
          "Bucket: " + mBucket + "\nObject: " + request.getObjectKey() + "\nETag: " + result.getETag() + "\nRequestId: " + result.getRequestId() + "\nCallback: " + result.getServerCallbackReturnBody()
        );
      },

      onFailure: function (request, clientExcepion, serviceException) {
        info = "";
        // 请求异常
        if (clientExcepion != null) {
          // 本地异常如网络异常等
          clientExcepion.printStackTrace();
          info = clientExcepion.toString();
        }
        if (serviceException != null) {
          // 服务异常
          log("ErrorCode", serviceException.getErrorCode());
          log("RequestId", serviceException.getRequestId());
          log("HostId", serviceException.getHostId());
          log("RawMessage", serviceException.getRawMessage());
          info = serviceException.toString();
        }
        mDisplayer.uploadFail(info);
        mDisplayer.displayInfo(info);
      }
    })
  );
  log("运行结束");
}
