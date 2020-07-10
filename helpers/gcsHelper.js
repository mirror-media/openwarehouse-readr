var gcloud = require('gcloud');

getPublicUrl = function (bucket, filename) {
	return `https://storage.googleapis.com/{bucket}/{filename}`;
};

uploadFileToBucket = function (bucket, fileReadStream, options) {
	return new Promise(function (resolve, reject) {
		var opts = options || {};
		var file = bucket.file(opts.destination);
        var metadata = {};

       if (opts.filetype) {
           metadata.contentType = opts.filetype;
       }

      if (opts.cacheControl) {
          metadata.cacheControl = opts.cacheControl;
      }
		fileReadStream
			.pipe(file.createWriteStream({
				metadata: metadata,
			}))
			.on('error', function (err) {
				console.log(err);
				reject(err);
			})
			.on('finish', function () {
				console.log('finish uploading to bucket with destination:', opts.destination);
				file.makePublic(function (err, apiResponse) {
					if (err) {
						return reject(err);
					}
					resolve(apiResponse);
				});
			});
	});
};

makeFilePublicPrivateRead = function (file, isPublicRead) {
	return new Promise(function (resolve, reject) {
		if (isPublicRead) {
			file.makePublic(function (err, apiResponse) {
				if (err) {
					return reject(err);
				}
				resolve(apiResponse);
			});
		} else {
			file.makePrivate(function (err, apiResponse) {
				if (err) {
					return reject(err);
				}
				resolve(apiResponse);
			});
		}
	});
};

initBucket = function (config, bucket) {
	var gcs = gcloud.storage({
		projectId: config.projectId,
		keyFilename: config.keyFilename,
	});

	return gcs.bucket(bucket);
};

getGcsFiles = function (bucket, filename) {
	return new Promise(function (resolve, reject) {
		bucket.getFiles({
			prefix: filename,
		}, function (err, files) {
			if (err) {
				return reject(err);
			}
			resolve(files);
		});
	});
};


module.exports = {getPublicUrl, uploadFileToBucket, makeFilePublicPrivateRead, initBucket, getGcsFiles}
