# import os
# import json
# import logging
# from datetime import datetime, timezone
# from pyspark.sql import SparkSession
# from pyspark.sql.functions import from_json, col
# from pyspark.sql.types import StructType, StructField, StringType, FloatType, BooleanType

# from anomaly_detector import detector
# from mongo_writer import write_raw_events, write_metrics, write_anomalies

# logging.basicConfig(level=logging.INFO, format="%(asctime)s [SPARK] %(message)s")

# KAFKA_BROKER = "localhost:9092"
# KAFKA_TOPIC = "clickstream-events"

# # Path to local JARs folder
# JARS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "jars")
# JARS = ",".join([
#     os.path.join(JARS_DIR, "spark-sql-kafka-0-10_2.12-3.5.0.jar"),
#     os.path.join(JARS_DIR, "kafka-clients-3.4.1.jar"),
#     os.path.join(JARS_DIR, "spark-token-provider-kafka-0-10_2.12-3.5.0.jar"),
#     os.path.join(JARS_DIR, "spark-streaming-kafka-0-10_2.12-3.5.0.jar"),
#     os.path.join(JARS_DIR, "commons-pool2-2.11.1.jar"),
# ])

# EVENT_SCHEMA = StructType([
#     StructField("event_id", StringType()),
#     StructField("user_id", StringType()),
#     StructField("session_id", StringType()),
#     StructField("event_type", StringType()),
#     StructField("page", StringType()),
#     StructField("product_id", StringType()),
#     StructField("category", StringType()),
#     StructField("price", FloatType()),
#     StructField("timestamp", StringType()),
#     StructField("device", StringType()),
#     StructField("country", StringType()),
#     StructField("is_anomalous", BooleanType()),
# ])

# def process_batch(batch_df, batch_id):
#     if batch_df.rdd.isEmpty():
#         return

#     rows = batch_df.collect()
#     events = [row.asDict() for row in rows]

#     logging.info(f"Batch {batch_id}: processing {len(events)} events")

#     # Write raw events
#     write_raw_events(events)

#     # Funnel counts
#     counts = {"page_view": 0, "add_to_cart": 0, "checkout": 0, "purchase": 0, "search": 0, "product_click": 0}
#     sessions = {}
#     for e in events:
#         et = e.get("event_type", "")
#         if et in counts:
#             counts[et] += 1
#         sid = e.get("session_id")
#         if sid not in sessions:
#             sessions[sid] = 0
#         sessions[sid] += 1

#     page_views = counts["page_view"] or 1
#     purchases = counts["purchase"]
#     cvr = round((purchases / page_views) * 100, 2)

#     total_sessions = len(sessions)
#     bounce_sessions = sum(1 for v in sessions.values() if v == 1)
#     bounce_rate = round((bounce_sessions / total_sessions) * 100, 2) if total_sessions > 0 else 0

#     unique_users = len(set(e.get("user_id") for e in events))

#     metrics = {
#         "window_start": datetime.now(timezone.utc).isoformat(),
#         "batch_id": batch_id,
#         "funnel": {
#             "page_view": counts["page_view"],
#             "add_to_cart": counts["add_to_cart"],
#             "checkout": counts["checkout"],
#             "purchase": counts["purchase"],
#         },
#         "cvr": cvr,
#         "bounce_rate": bounce_rate,
#         "session_count": total_sessions,
#         "active_users": unique_users,
#         "event_breakdown": counts
#     }

#     write_metrics(metrics)

#     # Anomaly detection
#     anomalies = detector.detect(events)
#     if anomalies:
#         write_anomalies(anomalies)
#         logging.info(f"Batch {batch_id}: {len(anomalies)} anomalies detected")

# def main():
#     spark = SparkSession.builder \
#         .appName("StreamSight-ClickStream-Processor") \
#         .config("spark.jars", JARS) \
#         .config("spark.sql.shuffle.partitions", "2") \
#         .getOrCreate()

#     spark.sparkContext.setLogLevel("WARN")
#     logging.info("Spark session started. Connecting to Kafka...")

#     raw_stream = spark.readStream \
#         .format("kafka") \
#         .option("kafka.bootstrap.servers", KAFKA_BROKER) \
#         .option("subscribe", KAFKA_TOPIC) \
#         .option("startingOffsets", "latest") \
#         .option("failOnDataLoss", "false") \
#         .load()

#     parsed_stream = raw_stream.select(
#         from_json(col("value").cast("string"), EVENT_SCHEMA).alias("data")
#     ).select("data.*")

#     query = parsed_stream.writeStream \
#         .foreachBatch(process_batch) \
#         .trigger(processingTime="5 seconds") \
#         .option("checkpointLocation", "C:/tmp/spark_checkpoint_streamsight") \
#         .start()

#     logging.info("Spark Streaming query started. Waiting for events...")
#     query.awaitTermination()

# if __name__ == "__main__":
#     main()

import os
import json
import logging
from datetime import datetime, timezone
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import StructType, StructField, StringType, FloatType, BooleanType

from anomaly_detector import detector
from mongo_writer import write_raw_events, write_metrics, write_anomalies

logging.basicConfig(level=logging.INFO, format="%(asctime)s [ANOMALY] %(message)s")

KAFKA_BROKER = "localhost:9092"
KAFKA_TOPIC  = "clickstream-events"

JARS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "jars")
JARS = ",".join([
    os.path.join(JARS_DIR, "spark-sql-kafka-0-10_2.12-3.5.0.jar"),
    os.path.join(JARS_DIR, "kafka-clients-3.4.1.jar"),
    os.path.join(JARS_DIR, "spark-token-provider-kafka-0-10_2.12-3.5.0.jar"),
    os.path.join(JARS_DIR, "spark-streaming-kafka-0-10_2.12-3.5.0.jar"),
    os.path.join(JARS_DIR, "commons-pool2-2.11.1.jar"),
])

EVENT_SCHEMA = StructType([
    StructField("event_id",    StringType()),
    StructField("user_id",     StringType()),
    StructField("session_id",  StringType()),
    StructField("event_type",  StringType()),
    StructField("page",        StringType()),
    StructField("product_id",  StringType()),
    StructField("category",    StringType()),
    StructField("price",       FloatType()),
    StructField("timestamp",   StringType()),
    StructField("device",      StringType()),
    StructField("country",     StringType()),
    StructField("is_anomalous",BooleanType()),
])

def process_batch(batch_df, batch_id):
    try:
        # ✅ FIX 1: Use .collect() first — NEVER call .rdd.isEmpty() or .head()
        # Those trigger Python worker tasks which cause socket.timeout crash
        rows = batch_df.collect()

        # ✅ FIX 1: Check emptiness on the collected Python list — safe, no Spark job
        if not rows:
            logging.info(f"Batch {batch_id}: empty — skipping")
            return

        events = [row.asDict() for row in rows]
        logging.info(f"Batch {batch_id}: processing {len(events)} events")

        # Write raw events to MongoDB
        write_raw_events(events)

        # Funnel counts
        counts = {
            "page_view": 0, "add_to_cart": 0, "checkout": 0,
            "purchase": 0, "search": 0, "product_click": 0
        }
        sessions = {}
        for e in events:
            et = e.get("event_type", "")
            if et in counts:
                counts[et] += 1
            sid = e.get("session_id", "unknown")
            sessions[sid] = sessions.get(sid, 0) + 1

        page_views    = max(counts["page_view"], 1)
        purchases     = counts["purchase"]
        cvr           = round((purchases / page_views) * 100, 2)
        total_sessions = len(sessions)
        bounce_sessions = sum(1 for v in sessions.values() if v == 1)
        bounce_rate   = round((bounce_sessions / total_sessions) * 100, 2) if total_sessions > 0 else 0
        unique_users  = len(set(e.get("user_id") for e in events if e.get("user_id")))

        metrics = {
            # ✅ FIX 2: Store as datetime OBJECT not isoformat string
            # isoformat() string breaks MongoDB $gte date range queries
            "window_start": datetime.now(timezone.utc),
            "written_at":   datetime.now(timezone.utc),
            "batch_id":     batch_id,
            "funnel": {
                "page_view":   counts["page_view"],
                "add_to_cart": counts["add_to_cart"],
                "checkout":    counts["checkout"],
                "purchase":    counts["purchase"],
            },
            "cvr":           cvr,
            "bounce_rate":   bounce_rate,
            "session_count": total_sessions,
            "active_users":  unique_users,
            "event_breakdown": counts,
        }

        write_metrics(metrics)

        # Anomaly detection
        anomalies = detector.detect(events)
        if anomalies:
            write_anomalies(anomalies)
            logging.info(f"Batch {batch_id}: {len(anomalies)} anomalies detected")

    except Exception as e:
        # ✅ FIX 3: Catch all exceptions so one bad batch doesn't kill the stream
        logging.error(f"Batch {batch_id}: Error — {e}", exc_info=True)


def main():
    spark = SparkSession.builder \
        .appName("StreamSight-ClickStream-Processor") \
        .config("spark.jars", JARS) \
        .config("spark.sql.shuffle.partitions", "2") \
        .getOrCreate()

    spark.sparkContext.setLogLevel("WARN")
    logging.info("Spark session started. Connecting to Kafka...")

    raw_stream = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", KAFKA_BROKER) \
        .option("subscribe", KAFKA_TOPIC) \
        .option("startingOffsets", "latest") \
        .option("failOnDataLoss", "false") \
        .load()

    parsed_stream = raw_stream.select(
        from_json(col("value").cast("string"), EVENT_SCHEMA).alias("data")
    ).select("data.*")

    query = parsed_stream.writeStream \
        .foreachBatch(process_batch) \
        .trigger(processingTime="5 seconds") \
        .option("checkpointLocation", "P:/spark_checkpoint") \
        .start()

    logging.info("Spark Streaming query started. Waiting for events...")
    query.awaitTermination()


if __name__ == "__main__":
    main()
