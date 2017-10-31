# OMAR MENSA

## Source Location
[https://github.com/ossimlabs/omar-mensa](https://github.com/ossimlabs/omar-mensa)

## Purpose
The OMAR Mensa Service provides mensuration capabilities on the imagery available to the platform. Mensa uses elevation data and other OMAR services to provide measurements on imagery such as along a path or in an area.

## Dockerfile
```
FROM omar-ossim-base
EXPOSE 8080
RUN mkdir /usr/share/omar
COPY omar-mensa-app-1.0.0-SNAPSHOT.jar /usr/share/omar
RUN chown -R 1001:0 /usr/share/omar
RUN chown 1001:0 /usr/share/omar
RUN chmod -R g+rw /usr/share/omar
RUN find $HOME -type d -exec chmod g+x {} +
USER 1001
WORKDIR /usr/share/omar
CMD java -server -Xms256m -Xmx1024m -Djava.awt.headless=true -XX:+CMSClassUnloadingEnabled -XX:+UseGCOverheadLimit -Djava.security.egd=file:/dev/./urandom -jar omar-mensa-app-1.0.0-SNAPSHOT.jar
```
Ref: [omar-ossim-base](../../../omar-ossim-base/docs/install-guide/omar-ossim-base/)

## JAR
[https://artifactory.ossim.io/artifactory/webapp/#/artifacts/browse/tree/General/omar-local/io/ossim/omar/apps/omar-mensa-app](https://artifactory.ossim.io/artifactory/webapp/#/artifacts/browse/tree/General/omar-local/io/ossim/omar/apps/omar-mensa-app)

## Installation in Openshift

**Assumption:** The omar-mensa-app docker image is pushed into the OpenShift server's internal docker registry and available to the project.

### Persistent Volumes

omar-mensa requires shared access to OSSIM imagery data. This data is assumed to be accessible from the local filesystem of the pod. Therefore, a volume mount must be mapped into the container. A PersistentVolumeClaim should be mounted to a configured location (see environment variables) in the service, but is typically */data*

### Environment variables

|Variable|Value|
|------|------|
|SPRING_PROFILES_ACTIVE|Comma separated profile tags (*e.g. production, dev*)|
|SPRING_CLOUD_CONFIG_LABEL|The Git branch from which to pull config files (*e.g. master*)|
|OSSIM_PREFS_FILE|The location of the preferences file (*e.g. /usr/share/ossim/ossim-site-preferences)|
|OSSIM_INSTALL_PREFIX|The directory in which OSSIM is installed (*e.g. /usr*)|
|OSSIM_DATA|The location of OSSIM imagery data such as elevation (*e.g. /data*)|
|BUCKETS|The S3 to mount for direct image access (*e.g. my-bucket*)|

### An Example DeploymentConfig
```yaml
apiVersion: v1
kind: DeploymentConfig
metadata:
  annotations:
    openshift.io/generated-by: OpenShiftNewApp
  creationTimestamp: null
  generation: 1
  labels:
    app: omar-openshift
  name: omar-mensa-app
spec:
  replicas: 1
  selector:
    app: omar-openshift
    deploymentconfig: omar-mensa-app
  strategy:
    activeDeadlineSeconds: 21600
    resources: {}
    rollingParams:
      intervalSeconds: 1
      maxSurge: 25%
      maxUnavailable: 25%
      timeoutSeconds: 600
      updatePeriodSeconds: 1
    type: Rolling
  template:
    metadata:
      annotations:
        openshift.io/generated-by: OpenShiftNewApp
      creationTimestamp: null
      labels:
        app: omar-openshift
        deploymentconfig: omar-mensa-app
    spec:
      containers:
      - env:
        - name: SPRING_PROFILES_ACTIVE
          value: dev
        - name: SPRING_CLOUD_CONFIG_LABEL
          value: master
        - name: OSSIM_PREFS_FILE
          value: /usr/share/ossim/ossim-site-preferences
        - name: OSSIM_INSTALL_PREFIX
          value: /usr
        - name: OSSIM_DATA
          value: /data
        - name: BUCKETS
          value: o2-test-data
        image: 172.30.181.173:5000/o2/omar-mensa-app@sha256:933fde867772eccafba01ee67b116498864a1d6ce95008b10aba1efc81300a20
        imagePullPolicy: Always
        livenessProbe:
          failureThreshold: 3
          initialDelaySeconds: 60
          periodSeconds: 10
          successThreshold: 1
          tcpSocket:
            port: 8080
          timeoutSeconds: 1
        name: omar-mensa-app
        ports:
        - containerPort: 8080
          protocol: TCP
        readinessProbe:
          failureThreshold: 3
          initialDelaySeconds: 30
          periodSeconds: 10
          successThreshold: 1
          tcpSocket:
            port: 8080
          timeoutSeconds: 1
        resources: {}
        securityContext:
          capabilities:
            add:
            - SYS_ADMIN
          privileged: true
          runAsUser: 1001
        terminationMessagePath: /dev/termination-log
        volumeMounts:
        - mountPath: /data
          name: volume-mensa
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      securityContext: {}
      terminationGracePeriodSeconds: 30
      volumes:
      - name: volume-mensa
        persistentVolumeClaim:
          claimName: ossim-data-dev-pvc
  test: false
  triggers:
  - type: ConfigChange
  - imageChangeParams:
      automatic: true
      containerNames:
      - omar-mensa-app
      from:
        kind: ImageStreamTag
        name: omar-mensa-app:latest
        namespace: o2
    type: ImageChange
status:
  availableReplicas: 0
  latestVersion: 0
  observedGeneration: 0
  replicas: 0
  unavailableReplicas: 0
  updatedReplicas: 0
```

## Configuration

There are no additional YAML properties other than the common properties found [Common Config Settings](../../../omar-common/docs/install-guide/omar-common/#common-config-settings).
